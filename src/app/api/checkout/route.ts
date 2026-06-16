import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import { getMercadoPago } from "@/lib/mercadopago/client";
import { quoteShipping } from "@/lib/melhorenvio/client";
import { serverEnv, clientEnv } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const checkoutSchema = z.object({
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
  payment_method: z.enum(["pix", "credit_card", "boleto"]),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid", issues: parsed.error.format() },
      { status: 422 }
    );
  }
  const data = parsed.data;
  const env = serverEnv();

  // 1. Pegar cliente logado (opcional — checkout guest também é OK)
  const supabaseUser = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabaseUser.auth.getUser();

  // 2. Re-buscar produtos no banco (NUNCA confiar nos preços do body)
  const admin = createSupabaseAdminClient();
  const productIds = data.items.map((i) => i.product_id);
  const { data: products, error: prodErr } = await admin
    .from("products")
    .select("id, name, slug, price_cents, stock_quantity, status, weight_g, width_cm, height_cm, length_cm")
    .in("id", productIds);

  if (prodErr || !products) {
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  // 3. Validar disponibilidade e calcular dimensões/peso totais pro frete
  let subtotal = 0;
  let totalWeightKg = 0;
  let maxWidth = 11, maxHeight = 2, maxLength = 16; // mínimos Correios PAC
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

  // 4. Re-cotar frete server-side e validar shipping_service_id
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
    // Melhor Envio fora? Cai pra fallback (registra log e segue)
    console.warn("ME shipping quote failed, using fallback", e);
  }

  // 5. Frete grátis acima do threshold
  if (subtotal >= env.STORE_FREE_SHIPPING_THRESHOLD_CENTS) {
    shippingCents = 0;
  }

  const totalCents = subtotal + shippingCents;

  // 6. Criar order (status pending, sem decrementar estoque ainda — só quando paid)
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
      payment_method: data.payment_method,
    })
    .select("id, order_number")
    .single();

  if (orderErr || !order) {
    return NextResponse.json(
      { error: "order_creation_failed", detail: orderErr?.message },
      { status: 500 }
    );
  }

  // 7. Inserir order_items (snapshot do produto pra histórico imutável)
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
    // Rollback: deleta o pedido órfão
    await admin.from("orders").delete().eq("id", order.id);
    return NextResponse.json(
      { error: "items_creation_failed", detail: itemsErr.message },
      { status: 500 }
    );
  }

  // 8. Criar preference no Mercado Pago
  const { preference } = getMercadoPago();
  const siteUrl = clientEnv.NEXT_PUBLIC_SITE_URL;
  const isSandbox = env.MP_ACCESS_TOKEN.startsWith("TEST-");
  try {
    const pref = await preference.create({
      body: {
        items: itemsSnapshot.map((it) => ({
          id: it.product_id,
          title: it.name,
          quantity: it.quantity,
          unit_price: it.unit_price_cents / 100,
          currency_id: "BRL",
        })),
        shipments: {
          cost: shippingCents / 100,
          mode: "not_specified",
        },
        payer: {
          email: data.customer.email,
          name: data.customer.full_name.split(" ")[0],
          surname:
            data.customer.full_name.split(" ").slice(1).join(" ") ||
            data.customer.full_name,
          identification: { type: "CPF", number: data.customer.cpf },
          phone: { number: data.customer.phone },
          address: {
            zip_code: data.shipping_address.postal_code,
            street_name: data.shipping_address.street,
            street_number: data.shipping_address.number,
          },
        },
        external_reference: order.id,
        notification_url: `${siteUrl}/api/webhooks/mercadopago`,
        back_urls: {
          success: `${siteUrl}/pedidos/${order.id}?ok=1`,
          failure: `${siteUrl}/checkout?error=payment_failed&order=${order.id}`,
          pending: `${siteUrl}/pedidos/${order.id}?pending=1`,
        },
        auto_return: "approved",
        statement_descriptor: "LUPERFUMES",
        // Restringe métodos ao escolhido
        payment_methods:
          data.payment_method === "pix"
            ? {
                excluded_payment_types: [
                  { id: "credit_card" },
                  { id: "ticket" },
                ],
              }
            : data.payment_method === "credit_card"
              ? {
                  excluded_payment_types: [{ id: "ticket" }],
                  excluded_payment_methods: [{ id: "pix" }],
                  installments: 3,
                }
              : { excluded_payment_types: [{ id: "credit_card" }] },
      },
    });

    await admin
      .from("orders")
      .update({ mp_preference_id: pref.id })
      .eq("id", order.id);

    return NextResponse.json({
      order_id: order.id,
      order_number: order.order_number,
      mp_preference_id: pref.id,
      init_point: isSandbox ? pref.sandbox_init_point : pref.init_point,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    // Rollback: marca order como falha
    await admin
      .from("orders")
      .update({ status: "canceled", notes: `MP preference failed: ${msg}` })
      .eq("id", order.id);
    return NextResponse.json(
      { error: "mp_preference_failed", detail: msg },
      { status: 502 }
    );
  }
}
