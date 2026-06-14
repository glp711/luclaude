import type { MetadataRoute } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/produtos`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/sobre`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contato`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/trocas-devolucoes`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/politica-de-privacidade`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  try {
    const supabase = await createSupabaseServerClient();

    const [{ data: categories }, { data: products }] = await Promise.all([
      supabase.from("categories").select("slug"),
      supabase
        .from("products")
        .select("slug, updated_at")
        .eq("status", "active"),
    ]);

    const categoryRoutes: MetadataRoute.Sitemap = (categories ?? []).map((c) => ({
      url: `${baseUrl}/produtos?categoria=${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    const productRoutes: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
      url: `${baseUrl}/produtos/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
  } catch {
    // Em caso de falha na conexão com Supabase (build sem env), retorna só estáticas
    return staticRoutes;
  }
}
