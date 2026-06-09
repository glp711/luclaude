import { z } from "zod";

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
});

const serverSchema = clientSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  MP_ACCESS_TOKEN: z.string().min(1),
  MP_WEBHOOK_SECRET: z.string().min(1),
  MELHORENVIO_TOKEN: z.string().min(1),
  MELHORENVIO_BASE_URL: z.string().url(),
  STORE_ORIGIN_CEP: z.string().regex(/^\d{8}$/, "CEP deve ter 8 dígitos"),
  STORE_FALLBACK_SHIPPING_CENTS: z.coerce.number().int().nonnegative().default(2500),
  STORE_FREE_SHIPPING_THRESHOLD_CENTS: z.coerce.number().int().nonnegative().default(25000),
  RESEND_API_KEY: z.string().min(1),
  ADMIN_NOTIFICATION_EMAIL: z.string().email(),
});

export const clientEnv = clientSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

let cached: z.infer<typeof serverSchema> | null = null;

export function serverEnv() {
  if (typeof window !== "undefined") {
    throw new Error(
      "serverEnv() foi importado num componente client. " +
      "Mova o código pra um Server Component, Route Handler, Server Action ou script."
    );
  }
  if (!cached) cached = serverSchema.parse(process.env);
  return cached;
}
