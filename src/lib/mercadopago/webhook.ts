import { createHmac, timingSafeEqual } from "node:crypto";
import { serverEnv } from "@/lib/env";

/**
 * Valida assinatura do webhook do Mercado Pago.
 * Doc: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks#editor_4
 *
 * Headers esperados:
 *   x-signature: ts=...,v1=...
 *   x-request-id: ...
 *
 * Manifest: id:<dataId>;request-id:<requestId>;ts:<ts>;
 */
export function verifyMercadoPagoSignature(params: {
  signatureHeader: string | null;
  requestIdHeader: string | null;
  dataId: string;
}): boolean {
  const { signatureHeader, requestIdHeader, dataId } = params;
  if (!signatureHeader || !requestIdHeader) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((kv) => {
      const [k, v] = kv.split("=");
      return [k?.trim(), v?.trim()];
    })
  );
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  const candidates = [dataId, dataId.toLowerCase()];

  for (const id of candidates) {
    const manifest = `id:${id};request-id:${requestIdHeader};ts:${ts};`;
    const expected = createHmac("sha256", serverEnv().MP_WEBHOOK_SECRET)
      .update(manifest)
      .digest("hex");

    try {
      if (timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(v1, "hex"))) {
        return true;
      }
    } catch {
      return false;
    }
  }

  return false;
}
