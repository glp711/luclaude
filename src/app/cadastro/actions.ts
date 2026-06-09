"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { clientEnv } from "@/lib/env";

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const full_name = String(formData.get("full_name") ?? "").trim();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name },
      emailRedirectTo: `${clientEnv.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    const msg = error.message.toLowerCase();
    const code = msg.includes("already") ? "exists" : msg.includes("weak") ? "weak" : "other";
    redirect(`/cadastro?error=${code}`);
  }

  redirect(`/cadastro?sent=1`);
}
