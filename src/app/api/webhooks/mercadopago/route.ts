import { NextRequest, NextResponse } from "next/server";
import { verifyMercadoPagoSignature } from "@/lib/mercadopago/webhook";
import { getMercadoPago } from "@/lib/mercadopago/client";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Webhook Mercado Pago.
 *
 * Garantias:
 * 1. Assinatura validada (HMAC SHA256).
 * 2. Idempotência via webhook_events.unique(source, event_id).
 * 3. Re-consulta a API do MP por payment_id — não confia no payload.
 * 4. Sempre retorna 200 pra eventos já processados (não causa retry tempestade).
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

  if (!verifyMercadoPagoSignature({
    signatureHeader: sigHeader,
    requestIdHeader: reqIdHeader,
    dataId,
  })) {
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

  // Só processamos eventos de payment por enquanto
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
    // TODO: mapear status MP → orders.status, decrementar estoque, disparar etiqueta + e-mail.
    await supabase
      .from("webhook_events")
      .update({ processed_at: new Date().toISOString() })
      .eq("event_id", eventId);
    return NextResponse.json({ ok: true, mpStatus: mpPayment.status });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await supabase
      .from("webhook_events")
      .update({ processing_error: msg })
      .eq("event_id", eventId);
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }
}
