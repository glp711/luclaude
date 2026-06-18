import { clientEnv } from "@/lib/env";

const BLOCKED_AUTH_PREFIXES = ["/login", "/cadastro", "/logout"];

export function siteOrigin() {
  return clientEnv.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
}

export function safeInternalPath(
  raw: string | null | undefined,
  fallback = "/"
): string {
  if (!raw) return fallback;
  if (!raw.startsWith("/") || raw.startsWith("//")) return fallback;

  try {
    const url = new URL(raw, "https://local.invalid");
    const path = `${url.pathname}${url.search}${url.hash}`;
    if (BLOCKED_AUTH_PREFIXES.some((prefix) => path.startsWith(prefix))) {
      return fallback;
    }
    return path;
  } catch {
    return fallback;
  }
}

export function buildEmailConfirmationRedirect(next = "/minha-conta?confirmed=1") {
  return `${siteOrigin()}/auth/callback?next=${encodeURIComponent(next)}`;
}
