"use server";

import { redirect } from "next/navigation";
import { buildEmailConfirmationRedirect } from "@/lib/auth/paths";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const full_name = String(formData.get("full_name") ?? "").trim();

  if (!full_name || !email || !password) {
    redirect("/cadastro?error=missing");
  }

  if (password.length < 8) {
    redirect(`/cadastro?error=weak&email=${encodeURIComponent(email)}`);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name },
      emailRedirectTo: buildEmailConfirmationRedirect(),
    },
  });

  if (error) {
    const code = mapSignUpError(error.message);
    redirect(`/cadastro?error=${code}&email=${encodeURIComponent(email)}`);
  }

  if (data.session) {
    redirect("/minha-conta?welcome=1");
  }

  redirect(`/cadastro?sent=1&email=${encodeURIComponent(email)}`);
}

export async function resendConfirmation(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    redirect("/cadastro?sent=1&resend=missing");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: buildEmailConfirmationRedirect(),
    },
  });

  if (error) {
    const msg = error.message.toLowerCase();
    const code = msg.includes("rate") || msg.includes("too many") ? "rate" : "error";
    redirect(`/cadastro?sent=1&email=${encodeURIComponent(email)}&resend=${code}`);
  }

  redirect(`/cadastro?sent=1&email=${encodeURIComponent(email)}&resend=1`);
}

function mapSignUpError(message: string) {
  const msg = message.toLowerCase();
  if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
    return "exists";
  }
  if (msg.includes("weak") || msg.includes("password")) return "weak";
  if (msg.includes("email")) return "invalid_email";
  if (msg.includes("rate") || msg.includes("too many")) return "rate";
  return "other";
}
