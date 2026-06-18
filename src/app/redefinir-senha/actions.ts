"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 8) redirect("/redefinir-senha?error=weak");
  if (password !== confirm) redirect("/redefinir-senha?error=mismatch");

  const supabase = await createSupabaseServerClient();
  // Pra updateUser funcionar, o usuário tem que ter chegado aqui via link do
  // Supabase (auth/callback) que já trocou code por session.
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?error=expired");

  const { error } = await supabase.auth.updateUser({ password });
  if (error) redirect("/redefinir-senha?error=failed");

  redirect("/login?reset=1");
}
