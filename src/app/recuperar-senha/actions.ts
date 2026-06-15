"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) redirect("/recuperar-senha?error=missing");

  const supabase = await createSupabaseServerClient();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

  // Sempre retorna sucesso pro usuário (não revela se o e-mail existe);
  // Supabase manda o link de redefinição via e-mail se a conta existir.
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/redefinir-senha`,
  });

  redirect("/recuperar-senha?sent=1");
}
