import { serverEnv } from "@/lib/env";

type FetchInit = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | undefined>;
};

/**
 * Cliente HTTP do Melhor Envio.
 * Doc: https://docs.melhorenvio.com.br/reference
 */
export async function meRequest<T = unknown>(path: string, init: FetchInit = {}): Promise<T> {
  const env = serverEnv();
  const url = new URL(path.replace(/^\//, ""), env.MELHORENVIO_BASE_URL + "/");
  if (init.query) {
    for (const [k, v] of Object.entries(init.query)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }

  const res = await fetch(url, {
    method: init.method ?? "GET",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.MELHORENVIO_TOKEN}`,
      "User-Agent": "Luperfumes (lopesguilherme2912@gmail.com)",
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Melhor Envio ${res.status} em ${path}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export type ShippingQuote = {
  id: number;
  name: string;
  price: string;       // string decimal
  custom_price: string;
  delivery_time: number; // dias úteis
  company: { id: number; name: string; picture: string };
  error?: string;
};

export async function quoteShipping(input: {
  fromCep: string;
  toCep: string;
  weight_kg: number;
  width_cm: number;
  height_cm: number;
  length_cm: number;
  insurance_value: number; // em reais
}): Promise<ShippingQuote[]> {
  const raw = await meRequest<ShippingQuote[]>("/api/v2/me/shipment/calculate", {
    method: "POST",
    body: {
      from: { postal_code: input.fromCep },
      to: { postal_code: input.toCep },
      products: [{
        id: "x",
        width: input.width_cm,
        height: input.height_cm,
        length: input.length_cm,
        weight: input.weight_kg,
        insurance_value: input.insurance_value,
        quantity: 1,
      }],
    },
  });
  return raw.filter((q) => !q.error);
}
