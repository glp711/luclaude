import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const checkoutSchema = z.object({
  items: z.array(z.object({
    product_id: z.string().uuid(),
    quantity: z.number().int().min(1).max(10),
  })).min(1),
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
    return NextResponse.json({ error: "invalid", issues: parsed.error.format() }, { status: 422 });
  }

  // TODO:
  // 1. Revalidar preço e estoque dos itens (server-side, NUNCA confiar no body).
  // 2. Cotar frete no Melhor Envio e validar shipping_service_id.
  // 3. Criar order + order_items em transação.
  // 4. Criar preference no Mercado Pago.
  // 5. Gerar guest_access_token se sem login.
  // 6. Retornar { order_id, mp_init_point, guest_access_token? }.

  return NextResponse.json({ error: "not implemented yet" }, { status: 501 });
}
