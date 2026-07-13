// Dados de contato centralizados para header, footer, contato e SEO.
export const WHATSAPP_NUMBER = "5561981361941";
export const WHATSAPP_DISPLAY = "(61) 98136-1941";
export const SUPPORT_EMAIL = "contato@luperfumes.com.br";
export const INSTAGRAM_HANDLE = "perfumesdeambientedecor";

export const STORE_ADDRESS = {
  streetAddress: "Av. das Araucárias, 1525",
  district: "Águas Claras",
  addressLocality: "Brasília",
  addressRegion: "DF",
  postalCode: "72025-065",
  addressCountry: "BR",
  full: "Av. das Araucárias, 1525 - Águas Claras, Brasília - DF, 72025-065, Brasil",
} as const;

export const STORE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_ADDRESS.full)}`;
