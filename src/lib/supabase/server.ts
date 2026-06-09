import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { clientEnv, serverEnv } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Cliente Supabase em Server Components / Route Handlers / Server Actions.
 * Respeita RLS — opera com a sessão do usuário autenticado (cookies).
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Components não podem escrever cookies — esperado.
            // Middleware é quem renova o token. Ignorar é seguro.
          }
        },
      },
    }
  );
}

/**
 * Cliente Supabase admin (service_role).
 *
 * BYPASSA RLS COMPLETAMENTE. Use apenas:
 *   - em webhooks (verificados por assinatura),
 *   - em fluxos de checkout server-side onde precisamos criar pedido/decrementar estoque,
 *   - em scripts de seed/import,
 *   - em ações de admin já autorizadas por checagem de role.
 *
 * NUNCA exponha esta função a um Client Component (o import "server-only" abaixo,
 * quando adicionado em produção, faria o build quebrar).
 */
export function createSupabaseAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error(
      "createSupabaseAdminClient() chamado no browser. " +
      "Service role NUNCA deve sair do servidor."
    );
  }
  const env = serverEnv();
  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );
}
