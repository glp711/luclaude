import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { serverEnv } from "@/lib/env";

let cached: { config: MercadoPagoConfig; preference: Preference; payment: Payment } | null = null;

export function getMercadoPago() {
  if (!cached) {
    const config = new MercadoPagoConfig({
      accessToken: serverEnv().MP_ACCESS_TOKEN,
      options: { timeout: 10_000 },
    });
    cached = {
      config,
      preference: new Preference(config),
      payment: new Payment(config),
    };
  }
  return cached;
}
