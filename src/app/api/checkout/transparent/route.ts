import { NextRequest, NextResponse } from "next/server";
import type { PaymentCreateRequest } from "mercadopago/dist/clients/payment/create/types";
import { z } from "zod";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import { getMercadoPago } from "@/lib/mercadopago/client";
import { quoteShipping } from "@/lib/melhorenvio/client";
import { serverEnv, clientEnv } from "@/lib/env";
import { sendOrderPaidEmail } from "@/lib/email/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const paymentDataSchema = z
  .object({
    payment_method_id: z.string().min(1),
    token: z.string().optional(),
    issuer_id: z.union([z.string(), z.number()]).optional(),
    installments: z.union([z.string(), z.number()]).optional(),
    transaction_amount: z.union([z.string(), z.number()]).optional(),
    payer: z.record(z.string(), z.unknown()).optional(),
    transaction_details: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough();

const checkoutTransparentSchema = z.object({
  items: z
    .array(
      z.object({
        product_id: z.string().uuid(),
        quantity: z.number().int().min(1).max(10),
      })
    )
    .min(1),
  shipping_address: z.object({
    postal_code: z.string().regex(/^\d{8}$/),
    street: z.string().min(1),
    number: z.string().min(1),
    complement: z.string().nullish(),
    neighborhood: z.string().min(1),
    city: z.string().min(1),
    state: z.string().length(2),
    recipient_name: z.string().min(1),
  }),
  shipping_service_id: z.number().int(),
  customer: z.object({
    email: z.string().email(),
    cpf: z.string().regex(/^\d{11}$/),
    phone: z.string().min(10),
    full_name: z.string().min(1),
  }),
  payment_method: z.enum(["pix", "credit_card", "boleto"]).optional(),
  selected_payment_method: z.string().optional(),
  payment_type: z.string().optional(),
  payment_data: paymentDataSchema,
});

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0] ?? fullName,
    lastName: parts.slice(1).join(" ") || parts[0] || fullName,
  };
}

function numberValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

function paymentMethodFromBrick(
  paymentMethodId: string,
  selectedPaymentMethod?: string,
  paymentType?: string
): "pix" | "credit_card" | "boleto" {
  if (paymentMethodId === "pix" || selectedPaymentMethod === "bank_transfer" || paymentType === "bank_transfer") {
    return "pix";
  }
  if (selectedPaymentMethod === "ticket" || paymentType === "ticket" || paymentMethodId.startsWith("bol")) {
    return "boleto";
  }
  return "credit_card";
}

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

function readRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;
}

function readString(obj: Record<string, unknown> | null, key: string) {
  const value = obj?.[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = checkoutTransparentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid", issues: parsed.error.format() },
      { status: 422 }
    );
  }

  const data = parsed.data;
  const env = serverEnv();
  const paymentMethodId = data.payment_data.payment_method_id;
  const paymentMethod =
    data.payment_method ??
    paymentMethodFromBrick(paymentMethodId, data.selected_payment_method, data.payment_type);

  const supabaseUser = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabaseUser.auth.getUser();

  const admin = createSupabaseAdminClient();
  const productIds = data.items.map((i) => i.product_id);
  const { data: products, error: prodErr } = await admin
    .from("products")
    .select("id, name, slug, price_cents, stock_quantity, status, weight_g, width_cm, height_cm, length_cm")
    .in("id", productIds);

  if (prodErr || !products) {
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  let subtotal = 0;
  let totalWeightKg = 0;
  let maxWidth = 11;
  let maxHeight = 2;
  let maxLength = 16;
  const itemsSnapshot: {
    product_id: string;
    name: string;
    slug: string;
    quantity: number;
    unit_price_cents: number;
  }[] = [];

  for (const item of data.items) {
    const prod = products.find((p) => p.id === item.product_id);
    if (!prod || prod.status !== "active") {
      return NextResponse.json(
        { error: "product_unavailable", product_id: item.product_id },
        { status: 422 }
      );
    }
    if (prod.stock_quantity < item.quantity) {
      return NextResponse.json(
        {
          error: "insufficient_stock",
          product_id: item.product_id,
          available: prod.stock_quantity,
        },
        { status: 409 }
      );
    }
    subtotal += prod.price_cents * item.quantity;
    totalWeightKg += ((prod.weight_g ?? 300) * item.quantity) / 1000;
    maxWidth = Math.max(maxWidth, prod.width_cm ?? 10);
    maxHeight = Math.max(maxHeight, prod.height_cm ?? 20);
    maxLength = Math.max(maxLength, prod.length_cm ?? 10);
    itemsSnapshot.push({
      product_id: prod.id,
      name: prod.name,
      slug: prod.slug,
      quantity: item.quantity,
      unit_price_cents: prod.price_cents,
    });
  }

  let shippingCents = env.STORE_FALLBACK_SHIPPING_CENTS;
  let shippingService: string | null = null;
  try {
    const quotes = await quoteShipping({
      fromCep: env.STORE_ORIGIN_CEP,
      toCep: data.shipping_address.postal_code,
      weight_kg: totalWeightKg,
      width_cm: maxWidth,
      height_cm: maxHeight,
      length_cm: maxLength,
      insurance_value: subtotal / 100,
    });
    const picked = quotes.find((q) => q.id === data.shipping_service_id);
    if (!picked) {
      return NextResponse.json(
        { error: "invalid_shipping_service" },
        { status: 422 }
      );
    }
    shippingCents = Math.round(parseFloat(picked.price) * 100);
    shippingService = `${picked.company.name} ${picked.name}`;
  } catch (e) {
    console.warn("ME shipping quote failed, using fallback", e);
  }

  if (subtotal >= env.STORE_FREE_SHIPPING_THRESHOLD_CENTS) {
    shippingCents = 0;
  }

  const totalCents = subtotal + shippingCents;
  const { firstName, lastName } = splitName(data.customer.full_name);

  const { data: order, error: orderErr } = await admin
    .from("orders")
    .insert({
      customer_id: user?.id ?? null,
      guest_email: user ? null : data.customer.email,
      status: "pending",
      subtotal_cents: subtotal,
      shipping_cents: shippingCents,
      discount_cents: 0,
      total_cents: totalCents,
      shipping_address: {
        ...data.shipping_address,
        customer_email: data.customer.email,
        customer_cpf: data.customer.cpf,
        customer_phone: data.customer.phone,
      },
      shipping_service: shippingService,
      payment_method: paymentMethod,
    })
    .select("id, order_number")
    .single();

  if (orderErr || !order) {
    return NextResponse.json(
      { error: "order_creation_failed", detail: orderErr?.message },
      { status: 500 }
    );
  }

  const { error: itemsErr } = await admin.from("order_items").insert(
    itemsSnapshot.map((it) => ({
      order_id: order.id,
      product_id: it.product_id,
      product_snapshot: { name: it.name, slug: it.slug },
      quantity: it.quantity,
      unit_price_cents: it.unit_price_cents,
    }))
  );
  if (itemsErr) {
    await admin.from("orders").delete().eq("id", order.id);
    return NextResponse.json(
      { error: "items_creation_failed", detail: itemsErr.message },
      { status: 500 }
    );
  }

  const { payment } = getMercadoPago();
  const siteUrl = clientEnv.NEXT_PUBLIC_SITE_URL;
  const issuerId = numberValue(data.payment_data.issuer_id);
  const installments = numberValue(data.payment_data.installments);

  const paymentBody: PaymentCreateRequest = {
    transaction_amount: totalCents / 100,
    description: `Pedido ${order.order_number} - Luperfumes`,
    payment_method_id: paymentMethodId,
    token: data.payment_data.token,
    issuer_id: issuerId,
    installments: installments ?? (paymentMethod === "credit_card" ? 1 : undefined),
    external_reference: order.id,
    notification_url: `${siteUrl}/api/webhooks/mercadopago`,
    statement_descriptor: "LUPERFUMES",
    payer: {
      email: data.customer.email,
      first_name: firstName,
      last_name: lastName,
      identification: { type: "CPF", number: data.customer.cpf },
      phone: { number: data.customer.phone },
      address: {
        zip_code: data.shipping_address.postal_code,
        street_name: data.shipping_address.street,
        street_number: data.shipping_address.number,
        neighborhood: data.shipping_address.neighborhood,
        city: data.shipping_address.city,
        federal_unit: data.shipping_address.state,
      },
    },
    additional_info: {
      items: itemsSnapshot.map((it) => ({
        id: it.product_id,
        title: it.name,
        quantity: it.quantity,
        unit_price: it.unit_price_cents / 100,
      })),
      shipments: {
        receiver_address: {
          zip_code: data.shipping_address.postal_code,
          street_name: data.shipping_address.street,
          street_number: data.shipping_address.number,
          apartment: data.shipping_address.complement ?? undefined,
        },
      },
    },
  };

  if (data.payment_data.transaction_details) {
    paymentBody.transaction_details = data.payment_data.transaction_details;
  }

  try {
    const mpPayment = await payment.create({
      body: paymentBody,
      requestOptions: { idempotencyKey: order.id },
    });

    const mpPaymentId = String(mpPayment.id ?? "");
    const orderStatus = mpStatusToOrderStatus(mpPayment.status);
    const updates: Record<string, unknown> = {
      mp_payment_id: mpPaymentId,
      updated_at: new Date().toISOString(),
    };
    if (orderStatus) updates.status = orderStatus;
    if (orderStatus === "paid") updates.paid_at = new Date().toISOString();

    await admin.from("orders").update(updates).eq("id", order.id);

    if (orderStatus === "paid") {
      for (const it of itemsSnapshot) {
        await admin.rpc("decrement_product_stock", {
          p_id: it.product_id,
          p_qty: it.quantity,
        });
      }

      try {
        await sendOrderPaidEmail({
          to: user ? null : data.customer.email,
          customerId: user?.id ?? null,
          orderNumber: order.order_number,
          totalCents,
        });
      } catch (e) {
        console.warn("sendOrderPaidEmail failed", e);
      }
    }

    const point = readRecord(mpPayment.point_of_interaction);
    const txData = readRecord(point?.transaction_data);
    const txDetails = readRecord(mpPayment.transaction_details);

    return NextResponse.json({
      order_id: order.id,
      order_number: order.order_number,
      payment_id: mpPaymentId,
      status: mpPayment.status,
      status_detail: mpPayment.status_detail,
      payment_method: paymentMethod,
      order_url: `/pedidos/${order.id}?${orderStatus === "paid" ? "ok=1" : "pending=1"}`,
      qr_code: readString(txData, "qr_code"),
      qr_code_base64: readString(txData, "qr_code_base64"),
      ticket_url: readString(txData, "ticket_url") ?? readString(txDetails, "external_resource_url"),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await admin
      .from("orders")
      .update({ status: "canceled", notes: `MP transparent payment failed: ${msg}` })
      .eq("id", order.id);
    return NextResponse.json(
      { error: "mp_payment_failed", detail: msg },
      { status: 502 }
    );
  }
}
