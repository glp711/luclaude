import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { quoteShipping } from "@/lib/melhorenvio/client";
import { serverEnv } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const quoteSchema = z.object({
  to_cep: z.string().regex(/^\d{8}$/),
  items: z.array(z.object({
    product_id: z.string().uuid(),
    quantity: z.number().int().min(1),
  })).min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 422 });
  }

  const env = serverEnv();

  // TODO: carregar peso/dim de cada produto do banco e somar.
  // Por ora, valores médios pra desbloquear UI.
  const weight_kg = 0.5 * parsed.data.items.reduce((s, i) => s + i.quantity, 0);
  const insurance_value = 100;

  try {
    const quotes = await quoteShipping({
      fromCep: env.STORE_ORIGIN_CEP,
      toCep: parsed.data.to_cep,
      weight_kg,
      width_cm: 20,
      height_cm: 20,
      length_cm: 20,
      insurance_value,
    });
    return NextResponse.json({ quotes });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({
      error: "melhor envio fora",
      detail: msg,
      fallback_cents: env.STORE_FALLBACK_SHIPPING_CENTS,
    }, { status: 503 });
  }
}
