"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const VALID_NEXT: Record<string, string[]> = {
  pending: ["canceled"],
  paid: ["preparing", "shipped", "canceled", "refunded"],
  preparing: ["shipped", "canceled"],
  shipped: ["delivered"],
  delivered: [],
  canceled: [],
  refunded: [],
};

export async function transitionOrder(orderId: string, next: string) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();

  const { data: order } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single();

  if (!order) return;

  const allowed = VALID_NEXT[order.status] ?? [];
  if (!allowed.includes(next)) {
    throw new Error(`Transição inválida ${order.status} → ${next}`);
  }

  const update: Record<string, unknown> = { status: next };
  const now = new Date().toISOString();
  if (next === "shipped") update.shipped_at = now;
  if (next === "delivered") update.delivered_at = now;

  await supabase.from("orders").update(update).eq("id", orderId);

  // TODO devolver estoque em canceled/refunded vindo de paid+
  // TODO disparar e-mail correspondente

  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${orderId}`);
}

export async function setTrackingCode(orderId: string, formData: FormData) {
  await requireAdmin();
  const code = String(formData.get("tracking_code") ?? "").trim();
  const carrier = String(formData.get("tracking_carrier") ?? "").trim();
  if (!code) throw new Error("Código de rastreio vazio");

  const supabase = createSupabaseAdminClient();
  await supabase
    .from("orders")
    .update({ tracking_code: code, tracking_carrier: carrier || null })
    .eq("id", orderId);

  revalidatePath(`/admin/pedidos/${orderId}`);
}
