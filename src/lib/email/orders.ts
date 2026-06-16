import { Resend } from "resend";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { serverEnv, clientEnv } from "@/lib/env";
import { formatBRL } from "@/lib/money";

let cachedClient: Resend | null = null;
function getResend(): Resend {
  if (!cachedClient) cachedClient = new Resend(serverEnv().RESEND_API_KEY);
  return cachedClient;
}

// Domínio default do Resend pra teste. Quando tiver domínio verificado,
// trocar pra "pedidos@luperfumes.com.br".
const FROM_ADDR = "Luperfumes <onboarding@resend.dev>";

export async function sendOrderPaidEmail(input: {
  to: string | null;
  customerId: string | null;
  orderNumber: number;
  totalCents: number;
}): Promise<void> {
  let toEmail = input.to;
  if (!toEmail && input.customerId) {
    const admin = createSupabaseAdminClient();
    const { data: user } = await admin.auth.admin.getUserById(input.customerId);
    toEmail = user.user?.email ?? null;
  }
  if (!toEmail) return;

  const resend = getResend();
  const site = clientEnv.NEXT_PUBLIC_SITE_URL;
  const total = formatBRL(input.totalCents);

  // E-mail pro cliente
  await resend.emails.send({
    from: FROM_ADDR,
    to: toEmail,
    subject: `Pedido #${input.orderNumber} confirmado · Luperfumes`,
    html: `
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#f5ecdc;color:#2d2924">
        <h1 style="font-size:28px;font-weight:400;margin:0 0 8px">Pedido confirmado ✓</h1>
        <p style="color:#6e655a;margin:0 0 24px">Pedido #${input.orderNumber}</p>
        <div style="background:#faf4e9;border:1px solid #ebe0cc;border-radius:16px;padding:20px;margin-bottom:20px">
          <p style="margin:0 0 8px">Recebemos o pagamento de <strong>${total}</strong>.</p>
          <p style="margin:0;color:#6e655a;font-size:14px">A LU já está preparando seu pedido com carinho. Você receberá outro e-mail quando o produto for postado, com o código de rastreio.</p>
        </div>
        <p><a href="${site}/minha-conta" style="display:inline-block;background:#efa89c;color:#fff;text-decoration:none;padding:12px 24px;border-radius:9999px;font-size:14px">Acompanhar pedido</a></p>
        <p style="color:#a89e91;font-size:12px;margin-top:32px">Qualquer dúvida, é só responder este e-mail.</p>
      </div>
    `,
  });

  // Notifica admin também
  const env = serverEnv();
  if (env.ADMIN_NOTIFICATION_EMAIL && env.ADMIN_NOTIFICATION_EMAIL !== toEmail) {
    await resend.emails.send({
      from: FROM_ADDR,
      to: env.ADMIN_NOTIFICATION_EMAIL,
      subject: `Novo pedido pago #${input.orderNumber} · ${total}`,
      html: `
        <p>Pedido #${input.orderNumber} marcado como pago.</p>
        <p>Total: ${total}<br>Cliente: ${toEmail}</p>
        <p><a href="${site}/admin/pedidos">Ver no admin</a></p>
      `,
    });
  }
}
