import Link from "next/link";
import { CampaignPopup } from "@/components/CampaignPopup";
import { Header } from "@/components/Header/Header";
import { Newsletter } from "@/components/Newsletter";
import { WhatsappFab } from "@/components/WhatsappFab";
import {
  INSTAGRAM_HANDLE,
  STORE_ADDRESS,
  STORE_MAPS_URL,
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER,
} from "@/lib/contact";
import { getCurrentUser } from "@/lib/auth/guards";

function TrustItem({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-10 w-10 rounded-full bg-sage-soft flex items-center justify-center text-lg flex-shrink-0">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-display text-sm text-ink leading-tight">{title}</p>
        <p className="text-xs text-ink-mute leading-tight">{sub}</p>
      </div>
    </div>
  );
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <>
      <a href="#main" className="skip-link">Pular para o conteudo</a>
      <Header user={user} />
      <CampaignPopup />

      <div id="main" className="flex-1">{children}</div>

      <section className="mx-auto max-w-7xl px-6 mt-20">
        <Newsletter />
      </section>

      <WhatsappFab />

      <section className="mt-20 border-t border-cream-deep/60 bg-cream-soft">
        <div className="mx-auto max-w-7xl px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <TrustItem icon="🔐" title="Compra segura" sub="SSL + Mercado Pago" />
          <TrustItem icon="📦" title="Envio em 24h" sub="Correios + Jadlog" />
          <TrustItem icon="💳" title="Pix, cartao, boleto" sub="parcele em 3x" />
          <TrustItem icon="↩️" title="7 dias para troca" sub="conforme o CDC" />
        </div>
      </section>

      <footer className="border-t border-cream-deep/60 bg-cream-soft">
        <div className="mx-auto max-w-7xl px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-mark.svg" alt="" className="h-9 w-9" />
              <span className="font-display text-xl text-ink">perfumes de ambiente decor</span>
            </div>
            <p className="text-ink-soft leading-relaxed max-w-xs">
              Perfumaria de ambiente, feita pra deixar memoria em cada cantinho da sua casa.
            </p>
            <a
              href={`https://www.instagram.com/${INSTAGRAM_HANDLE}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-xs text-ink-soft hover:text-coral-deep transition"
            >
              <span>📷</span> @{INSTAGRAM_HANDLE}
            </a>
            <address className="mt-4 max-w-xs text-xs not-italic leading-relaxed text-ink-mute">
              {STORE_ADDRESS.full}
            </address>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-soft transition hover:text-coral-deep"
              >
                WhatsApp {WHATSAPP_DISPLAY}
              </a>
              <a
                href={STORE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-soft transition hover:text-coral-deep"
              >
                Ver no mapa
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-display text-lg text-ink mb-3">Loja</h3>
            <ul className="space-y-2 text-ink-soft">
              <li><Link href="/produtos" className="hover:text-coral-deep transition">Catalogo</Link></li>
              <li><Link href="/produtos?categoria=difusor-de-varetas" className="hover:text-coral-deep transition">Difusor de Varetas</Link></li>
              <li><Link href="/produtos?categoria=home-spray" className="hover:text-coral-deep transition">Home Spray</Link></li>
              <li><Link href="/marcas" className="hover:text-coral-deep transition">Marcas</Link></li>
              <li><Link href="/carrinho" className="hover:text-coral-deep transition">Carrinho</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-lg text-ink mb-3">Ajuda</h3>
            <ul className="space-y-2 text-ink-soft">
              <li><Link href="/trocas-devolucoes" className="hover:text-coral-deep transition">Trocas e devolucoes</Link></li>
              <li><Link href="/politica-de-privacidade" className="hover:text-coral-deep transition">Privacidade</Link></li>
              <li><Link href="/contato" className="hover:text-coral-deep transition">Contato</Link></li>
              <li><Link href="/sobre" className="hover:text-coral-deep transition">Sobre a marca</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-lg text-ink mb-3">Conta</h3>
            <ul className="space-y-2 text-ink-soft">
              <li><Link href="/login" className="hover:text-coral-deep transition">Entrar</Link></li>
              <li><Link href="/cadastro" className="hover:text-coral-deep transition">Criar conta</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-cream-deep/60">
          <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-ink-mute">
            <span>© {new Date().getFullYear()} perfumes de ambiente decor — Todos os direitos reservados.</span>
            <span className="italic font-display text-base text-coral-deep">@{INSTAGRAM_HANDLE}</span>
          </div>
        </div>
      </footer>
    </>
  );
}
