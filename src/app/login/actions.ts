"use server";

import { redirect } from "next/navigation";
import { buildEmailConfirmationRedirect, safeInternalPath } from "@/lib/auth/paths";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const from = safeInternalPath(String(formData.get("from") ?? ""), "");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const code =
      error.message.toLowerCase().includes("not confirmed") ? "not_confirmed" : "invalid";
    const qs = new URLSearchParams({ error: code, email });
    if (from) qs.set("from", from);
    redirect(`/login?${qs.toString()}`);
  }

  if (from) redirect(from);

  const {
    data: { user },
  } = await supabase.auth.getUser();
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

export async function resendLoginConfirmation(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const from = safeInternalPath(String(formData.get("from") ?? ""), "");

  if (!email) {
    redirect("/login?error=not_confirmed&resent=missing");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: buildEmailConfirmationRedirect(),
    },
  });

  const qs = new URLSearchParams({ error: "not_confirmed", email });
  if (from) qs.set("from", from);

  if (error) {
    const msg = error.message.toLowerCase();
    qs.set("resent", msg.includes("rate") || msg.includes("too many") ? "rate" : "error");
    redirect(`/login?${qs.toString()}`);
  }

  qs.set("resent", "1");
  redirect(`/login?${qs.toString()}`);
}
