"use server";

import { redirect } from "next/navigation";
import { buildEmailConfirmationRedirect } from "@/lib/auth/paths";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) redirect("/recuperar-senha?error=missing");

  const supabase = await createSupabaseServerClient();

  // Sempre retorna sucesso pro usuario para nao revelar se o e-mail existe.
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: buildEmailConfirmationRedirect("/redefinir-senha"),
  });

  redirect("/recuperar-senha?sent=1");
}
