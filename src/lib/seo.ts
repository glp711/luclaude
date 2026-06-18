import { INSTAGRAM_HANDLE } from "@/lib/contact";

export const SITE_NAME = "Perfumes de Ambiente Decor";
export const SITE_BRAND_NAME = "perfumes de ambiente decor";
export const SITE_DESCRIPTION =
  "Curadoria premium de perfumes de ambiente, difusores, home sprays, sabonetes e presentes perfumados para casa.";

export const SEO_KEYWORDS = [
  "perfumes de ambiente",
  "perfume de ambiente",
  "difusor de ambiente",
  "difusor de varetas",
  "home spray",
  "sabonete perfumado",
  "aromatizador de ambiente",
  "fragrancias para casa",
  "curadoria de aromas",
  "Dani Fernandes",
  "M. Victoria",
  "Lenvie",
  "Maison Berger",
  "Kailash",
];

const CANONICAL_PRODUCTION_URL = "https://www.perfumesdeambiente.com";

export function siteUrl(path = "/") {
  const configured = process.env.NEXT_PUBLIC_CANONICAL_SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL;
  const origin = pickCanonicalOrigin(configured).replace(/\/+$/, "");
  if (!path || path === "/") return `${origin}/`;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

function pickCanonicalOrigin(configured: string | undefined) {
  if (!configured) return CANONICAL_PRODUCTION_URL;
  if (configured.includes("localhost") || configured.includes("127.0.0.1")) return configured;
  if (configured.includes("luperfumes.vercel.app")) return CANONICAL_PRODUCTION_URL;
  return configured;
}

export function absoluteUrl(pathOrUrl: string | null | undefined) {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return siteUrl(pathOrUrl);
}

export function seoTitle(title?: string | null) {
  return title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Curadoria premium de aromas para casa`;
}

export function truncateDescription(value: string, max = 155) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max - 1).trim()}…`;
}

export const SOCIAL_LINKS = [`https://www.instagram.com/${INSTAGRAM_HANDLE}/`];
