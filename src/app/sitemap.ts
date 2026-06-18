import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteUrl().replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/produtos`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/marcas`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/sobre`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contato`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/trocas-devolucoes`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/politica-de-privacidade`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  try {
    const supabase = await createSupabaseServerClient();

    const [{ data: categories }, { data: brands }, { data: products }] = await Promise.all([
      supabase.from("categories").select("slug"),
      supabase.from("brands").select("slug").eq("active", true),
      supabase
        .from("products")
        .select("slug, updated_at")
        .eq("status", "active"),
    ]);

    const categoryRoutes: MetadataRoute.Sitemap = (categories ?? []).map((category) => ({
      url: `${baseUrl}/produtos?categoria=${category.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    const brandRoutes: MetadataRoute.Sitemap = (brands ?? []).map((brand) => ({
      url: `${baseUrl}/produtos?marca=${brand.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    const productRoutes: MetadataRoute.Sitemap = (products ?? []).map((product) => ({
      url: `${baseUrl}/produtos/${product.slug}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [...staticRoutes, ...categoryRoutes, ...brandRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
