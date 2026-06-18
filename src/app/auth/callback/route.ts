import { NextRequest, NextResponse } from "next/server";
import { safeInternalPath } from "@/lib/auth/paths";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const providerError = url.searchParams.get("error") || url.searchParams.get("error_code");
  const next = safeInternalPath(url.searchParams.get("next"), "/minha-conta?confirmed=1");

  if (providerError) {
    const errorCode =
      providerError === "otp_expired" || providerError.includes("expired")
        ? "expired"
        : "callback";
    return NextResponse.redirect(new URL(`/login?error=${errorCode}`, url.origin));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=callback", url.origin));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const errorCode = error.message.toLowerCase().includes("expired") ? "expired" : "callback";
    return NextResponse.redirect(new URL(`/login?error=${errorCode}`, url.origin));
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
