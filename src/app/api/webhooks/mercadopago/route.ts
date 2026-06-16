import { NextRequest, NextResponse } from "next/server";
import { verifyMercadoPagoSignature } from "@/lib/mercadopago/webhook";
import { getMercadoPago } from "@/lib/mercadopago/client";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { sendOrderPaidEmail } from "@/lib/email/orders";
import { serverEnv } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "mercadopago-webhook",
    status: "online",
    message: "Webhook online. O Mercado Pago usa POST assinado nesta URL; abrir no navegador faz apenas este teste de saude.",
    accepts: ["POST"],
  });
}

// Mapeia status do Mercado Pago → status interno do pedido.
function mpStatusToOrderStatus(mp: string | null | undefined): string | null {
  switch (mp) {
    case "approved":
      return "paid";
    case "in_process":
    case "pending":
    case "authorized":
      return "pending";
    case "rejected":
    case "cancelled":
      return "canceled";
    case "refunded":
    case "charged_back":
      return "refunded";
    default:
      return null;
  }
}

function mpOrderStatusToOrderStatus(status: string | null | undefined, detail: string | null | undefined): string | null {
  if (status === "processed" || status === "completed" || detail === "accredited") {
    return "paid";
  }
  if (status === "action_required" || status === "created" || status === "processing") {
    return "pending";
  }
  if (status === "cancelled" || status === "canceled" || status === "expired" || status === "failed") {
    return "canceled";
  }
  if (status === "refunded" || status === "charged_back") {
    return "refunded";
  }
  return null;
}

function readRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;
}

function readArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function readString(obj: Record<string, unknown> | null, key: string) {
  const value = obj?.[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

/**
 * Webhook Mercado Pago.
 *
 * Garantias:
 * 1. Assinatura validada (HMAC SHA256).
 * 2. Idempotência via webhook_events.unique(source, event_id).
 * 3. Re-consulta a API do MP por payment_id — não confia no payload.
 * 4. Sempre retorna 200 pra eventos já processados (evita retry storm).
 * 5. Decrementa estoque APENAS uma vez quando vira paid.
 */
export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const type = url.searchParams.get("type") ?? url.searchParams.get("topic");
  const dataId = url.searchParams.get("data.id") ?? url.searchParams.get("id");

  const sigHeader = req.headers.get("x-signature");
  const reqIdHeader = req.headers.get("x-request-id");

  if (!dataId) {
    return NextResponse.json({ error: "missing data.id" }, { status: 400 });
  }

  if (
    !verifyMercadoPagoSignature({
      signatureHeader: sigHeader,
      requestIdHeader: reqIdHeader,
      dataId,
    })
  ) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  const eventId = `${type ?? "unknown"}:${dataId}`;

  // Idempotência
  const payload = await req.json().catch(() => ({}));
  const { error: insertErr } = await supabase
    .from("webhook_events")
    .insert({ source: "mercadopago", event_id: eventId, payload });

  if (insertErr) {
    if (insertErr.code === "23505") return NextResponse.json({ ok: true, duplicate: true });
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }

  if (type === "order") {
    try {
      const orderRes = await fetch(`https://api.mercadopago.com/v1/orders/${dataId}`, {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${serverEnv().MP_ACCESS_TOKEN}`,
        },
      });
      const mpOrder = (await orderRes.json().catch(() => ({}))) as Record<string, unknown>;

      if (!orderRes.ok) {
        const detail = typeof mpOrder.message === "string" ? mpOrder.message : `MP order get failed ${orderRes.status}`;
        await supabase
          .from("webhook_events")
          .update({ processing_error: detail })
          .eq("event_id", eventId);
        return NextResponse.json({ error: "order fetch failed" }, { status: 500 });
      }

      const transactions = readRecord(mpOrder.transactions);
      const mpPayment = readRecord(readArray(transactions?.payments)[0]);
      const orderId = readString(mpOrder, "external_reference");
      const mpOrderId = readString(mpOrder, "id") ?? dataId;
      const mpPaymentId = readString(mpPayment, "id") ?? "";
      const orderStatus = mpOrderStatusToOrderStatus(
        readString(mpOrder, "status"),
        readString(mpOrder, "status_detail")
      );

      if (!orderId) {
        await supabase
          .from("webhook_events")
          .update({ processing_error: "missing external_reference", processed_at: new Date().toISOString() })
          .eq("event_id", eventId);
        return NextResponse.json({ ok: true, ignored: true });
      }

      await supabase.from("payments").insert({
        order_id: orderId,
        gateway: "mercadopago",
        gateway_payment_id: mpPaymentId || mpOrderId,
        status: readString(mpPayment, "status") ?? readString(mpOrder, "status") ?? "unknown",
        amount_cents: Math.round(Number(readString(mpPayment, "amount") ?? readString(mpOrder, "total_amount") ?? "0") * 100),
        raw_payload: mpOrder as object,
      });

      const { data: existing } = await supabase
        .from("orders")
        .select("id, order_number, status, customer_id, guest_email, total_cents, shipping_address")
        .eq("id", orderId)
        .single();

      if (!existing) {
        await supabase
          .from("webhook_events")
          .update({ processing_error: "order not found", processed_at: new Date().toISOString() })
          .eq("event_id", eventId);
        return NextResponse.json({ ok: true, orderNotFound: true });
      }

      const updates: Record<string, unknown> = {
        mp_preference_id: mpOrderId,
        updated_at: new Date().toISOString(),
      };
      if (mpPaymentId) updates.mp_payment_id = mpPaymentId;
      if (orderStatus) updates.status = orderStatus;
      if (orderStatus === "paid" && existing.status !== "paid") {
        updates.paid_at = new Date().toISOString();
      }

      await supabase.from("orders").update(updates).eq("id", orderId);

      if (orderStatus === "paid" && existing.status !== "paid") {
        const { data: items } = await supabase
          .from("order_items")
          .select("product_id, quantity")
          .eq("order_id", orderId);

        for (const it of items ?? []) {
          if (!it.product_id) continue;
          await supabase.rpc("decrement_product_stock", {
            p_id: it.product_id,
            p_qty: it.quantity,
          });
        }

        try {
          await sendOrderPaidEmail({
            to: existing.guest_email ?? null,
            customerId: existing.customer_id,
            orderNumber: existing.order_number,
            totalCents: existing.total_cents,
          });
        } catch (e) {
          console.warn("sendOrderPaidEmail failed", e);
        }
      }

      await supabase
        .from("webhook_events")
        .update({ processed_at: new Date().toISOString() })
        .eq("event_id", eventId);

      return NextResponse.json({
        ok: true,
        mpOrderStatus: readString(mpOrder, "status"),
        orderStatus,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      await supabase
        .from("webhook_events")
        .update({ processing_error: msg })
        .eq("event_id", eventId);
      return NextResponse.json({ error: "order processing failed" }, { status: 500 });
    }
  }

  // Só processamos eventos de payment no fluxo antigo.
  if (type !== "payment") {
    await supabase
      .from("webhook_events")
      .update({ processed_at: new Date().toISOString() })
      .eq("event_id", eventId);
    return NextResponse.json({ ok: true, skipped: true });
  }

  try {
    const { payment } = getMercadoPago();
    const mpPayment = await payment.get({ id: dataId });

    const orderId = mpPayment.external_reference;
    const mpPaymentId = String(mpPayment.id ?? "");
    const newStatus = mpStatusToOrderStatus(mpPayment.status);

    if (!orderId) {
      await supabase
        .from("webhook_events")
        .update({ processing_error: "missing external_reference", processed_at: new Date().toISOString() })
        .eq("event_id", eventId);
      return NextResponse.json({ ok: true, ignored: true });
    }

    // Loga sempre no payments
    await supabase.from("payments").insert({
      order_id: orderId,
      gateway: "mercadopago",
      gateway_payment_id: mpPaymentId,
      status: mpPayment.status ?? "unknown",
      amount_cents: Math.round((mpPayment.transaction_amount ?? 0) * 100),
      raw_payload: mpPayment as object,
    });

    if (!newStatus) {
      // Status desconhecido, registra mas não muda o pedido
      await supabase
        .from("webhook_events")
        .update({ processed_at: new Date().toISOString() })
        .eq("event_id", eventId);
      return NextResponse.json({ ok: true, mpStatus: mpPayment.status });
    }

    // Pega estado atual do pedido pra detectar transição
    const { data: existing } = await supabase
      .from("orders")
      .select("id, order_number, status, customer_id, guest_email, total_cents, shipping_address")
      .eq("id", orderId)
      .single();

    if (!existing) {
      await supabase
        .from("webhook_events")
        .update({ processing_error: "order not found", processed_at: new Date().toISOString() })
        .eq("event_id", eventId);
      return NextResponse.json({ ok: true, orderNotFound: true });
    }

    const updates: Record<string, unknown> = {
      status: newStatus,
      mp_payment_id: mpPaymentId,
      updated_at: new Date().toISOString(),
    };
    if (newStatus === "paid" && existing.status !== "paid") {
      updates.paid_at = new Date().toISOString();
    }

    await supabase.from("orders").update(updates).eq("id", orderId);

    // Transição pending → paid: decrementa estoque e envia e-mail
    if (newStatus === "paid" && existing.status !== "paid") {
      const { data: items } = await supabase
        .from("order_items")
        .select("product_id, quantity")
        .eq("order_id", orderId);

      for (const it of items ?? []) {
        if (!it.product_id) continue;
        // Atômico via SQL (evita race com checkouts concorrentes)
        await supabase.rpc("decrement_product_stock", {
          p_id: it.product_id,
          p_qty: it.quantity,
        });
      }

      try {
        await sendOrderPaidEmail({
          to: existing.guest_email ?? null,
          customerId: existing.customer_id,
          orderNumber: existing.order_number,
          totalCents: existing.total_cents,
        });
      } catch (e) {
        console.warn("sendOrderPaidEmail failed", e);
      }
    }

    await supabase
      .from("webhook_events")
      .update({ processed_at: new Date().toISOString() })
      .eq("event_id", eventId);

    return NextResponse.json({ ok: true, mpStatus: mpPayment.status, orderStatus: newStatus });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await supabase
      .from("webhook_events")
      .update({ processing_error: msg })
      .eq("event_id", eventId);
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }
}
