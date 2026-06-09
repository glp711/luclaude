import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SessionUser = {
  id: string;
  email: string | null;
  role: "customer" | "admin";
};

/**
 * Retorna o usuário autenticado + role, ou null.
 * Usa apenas a sessão do servidor (cookie httpOnly), nunca confia em claim do cliente.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role === "admin" ? "admin" : "customer";
  return { id: user.id, email: user.email ?? null, role };
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    // 404 (não 403) — não revelar existência do admin.
    notFound();
  }
  return user;
}
