"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const code =
      error.message.toLowerCase().includes("not confirmed") ? "not_confirmed" : "invalid";
    redirect(`/login?error=${code}`);
  }

  // descobrir destino: admin se for admin, /minha-conta caso contrário
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role === "admin") redirect("/admin");
  }
  redirect("/");
}
