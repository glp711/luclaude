"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Aceita redirect só pra paths internos (proteção contra open redirect)
function safeFrom(raw: string | null | undefined): string | null {
  if (!raw) return null;
  if (!raw.startsWith("/") || raw.startsWith("//")) return null;
  // bloqueia rotas auth, evita loop
  if (raw.startsWith("/login") || raw.startsWith("/cadastro") || raw.startsWith("/logout")) return null;
  return raw;
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const from = safeFrom(String(formData.get("from") ?? "")) ?? null;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const code =
      error.message.toLowerCase().includes("not confirmed") ? "not_confirmed" : "invalid";
    const qs = from ? `?error=${code}&from=${encodeURIComponent(from)}` : `?error=${code}`;
    redirect(`/login${qs}`);
  }

  // se veio de algum lugar protegido, volta pra lá; senão decide pelo role
  if (from) redirect(from);

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role === "admin") redirect("/admin");
  }
  redirect("/minha-conta");
}
