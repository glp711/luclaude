"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guards";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";

function parseBRLToCents(input: FormDataEntryValue | null): number | null {
  if (input == null) return null;
  const text = String(input).trim();
  if (!text) return null;
  const cleaned = text.replace(/\./g, "").replace(",", ".");
  const n = Number.parseFloat(cleaned);
  if (Number.isNaN(n) || n < 0) return null;
  return Math.round(n * 100);
}

function optStr(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  if (v == null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

function optInt(formData: FormData, key: string): number | null {
  const s = optStr(formData, key);
  if (s == null) return null;
  const n = Number.parseInt(s, 10);
  return Number.isNaN(n) ? null : n;
}

function optFloat(formData: FormData, key: string): number | null {
  const s = optStr(formData, key);
  if (s == null) return null;
  const n = Number.parseFloat(s);
  return Number.isNaN(n) ? null : n;
}

const productSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug deve ser kebab-case"),
  description: z.string().nullable(),
  price_cents: z.number().int().min(1, "Preço inválido"),
  compare_at_price_cents: z.number().int().nonnegative().nullable(),
  sku: z.string().nullable(),
  stock_quantity: z.number().int().nonnegative(),
  weight_g: z.number().int().nonnegative().nullable(),
  width_cm: z.number().nonnegative().nullable(),
  height_cm: z.number().nonnegative().nullable(),
  length_cm: z.number().nonnegative().nullable(),
  status: z.enum(["active", "draft", "archived"]),
  category_id: z.string().uuid().nullable(),
});

type ProductInput = z.infer<typeof productSchema>;

function parseForm(formData: FormData): { ok: true; data: ProductInput } | { ok: false; error: string } {
  const name = String(formData.get("name") ?? "").trim();
  const slug = optStr(formData, "slug") ?? slugify(name);
  const price_cents = parseBRLToCents(formData.get("price"));
  if (price_cents == null) return { ok: false, error: "Preço inválido" };

  const raw = {
    name,
    slug,
    description: optStr(formData, "description"),
    price_cents,
    compare_at_price_cents: parseBRLToCents(formData.get("compare_at_price")),
    sku: optStr(formData, "sku"),
    stock_quantity: optInt(formData, "stock_quantity") ?? 0,
    weight_g: optInt(formData, "weight_g"),
    width_cm: optFloat(formData, "width_cm"),
    height_cm: optFloat(formData, "height_cm"),
    length_cm: optFloat(formData, "length_cm"),
    status: String(formData.get("status") ?? "draft"),
    category_id: optStr(formData, "category_id"),
  };

  const result = productSchema.safeParse(raw);
  if (!result.success) {
    const msg = result.error.issues.map((i) => i.message).join("; ");
    return { ok: false, error: msg };
  }
  return { ok: true, data: result.data };
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.ok) {
    redirect(`/admin/produtos/novo?error=${encodeURIComponent(parsed.error)}`);
  }
  const supabase = createSupabaseAdminClient();
  const { data: created, error } = await supabase
    .from("products")
    .insert(parsed.data)
    .select("id")
    .single();

  if (error) {
    const msg = error.code === "23505" ? "Slug ou SKU já em uso" : error.message;
    redirect(`/admin/produtos/novo?error=${encodeURIComponent(msg)}`);
  }
  revalidatePath("/admin/produtos");
  redirect(`/admin/produtos/${created!.id}?ok=created`);
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.ok) {
    redirect(`/admin/produtos/${id}?error=${encodeURIComponent(parsed.error)}`);
  }
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("products").update(parsed.data).eq("id", id);
  if (error) {
    const msg = error.code === "23505" ? "Slug ou SKU já em uso" : error.message;
    redirect(`/admin/produtos/${id}?error=${encodeURIComponent(msg)}`);
  }
  revalidatePath("/admin/produtos");
  revalidatePath(`/admin/produtos/${id}`);
  redirect(`/admin/produtos/${id}?ok=updated`);
}

export async function archiveProduct(id: string) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  await supabase.from("products").update({ status: "archived" }).eq("id", id);
  revalidatePath("/admin/produtos");
}

export async function publishProduct(id: string) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  await supabase.from("products").update({ status: "active" }).eq("id", id);
  revalidatePath("/admin/produtos");
}
