import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const Schema = z.object({
  email: z.string().email().max(200),
  source: z.string().max(50).optional(),
});

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = Schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("newsletter_subscriptions").insert({
    email: parsed.data.email.toLowerCase(),
    source: parsed.data.source ?? "site",
  });

  // Duplicado (unique violation 23505) é tratado como sucesso silencioso
  // pra não revelar se o e-mail já estava cadastrado.
  if (error && error.code !== "23505") {
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
