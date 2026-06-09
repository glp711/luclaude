"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const slug = slugify(name);
  const supabase = createSupabaseAdminClient();
  await supabase.from("categories").insert({ name, slug });
  revalidatePath("/admin/categorias");
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/admin/categorias");
}

export async function renameCategory(id: string, formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const supabase = createSupabaseAdminClient();
  await supabase.from("categories").update({ name }).eq("id", id);
  revalidatePath("/admin/categorias");
}
