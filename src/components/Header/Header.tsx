import Link from "next/link";
import { CartLink } from "@/components/CartLink";
import { MegaMenu } from "@/components/Header/MegaMenu";
import { MobileMenuDrawer } from "@/components/Header/MobileMenuDrawer";
import { PromoBar } from "@/components/PromoBar";
import { SearchInput } from "@/components/Header/SearchInput";
import { WHATSAPP_NUMBER } from "@/lib/contact";
import type { SessionUser } from "@/lib/auth/guards";
import { buildNavItems, getDynamicMenuGroups } from "@/lib/menu-data";

/**
 * Cabecalho da loja em 3 linhas:
 *  1. Barra promocional (configuravel via PromoBar)
 *  2. Brand + busca + atalhos (atendimento, conta, carrinho)
 *  3. Navegacao principal (MegaMenu desktop / abre Drawer no mobile)
 *
 * Componentes server-side (Header) compoem componentes client (MegaMenu, Drawer,
 * SearchInput) sem precisar marcar o cabecalho inteiro como "use client".
 */
export async function Header({ user }: { user: SessionUser | null }) {
  const wppHref = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`;
  const menuGroups = await getDynamicMenuGroups();
  const navItems = buildNavItems(menuGroups);

  const userArea = user ? (
    user.role === "admin" ? (
      <Link
        href="/admin"
        className="block w-full rounded-full border border-cream-deep px-5 py-2.5 text-center text-sm text-ink hover:border-coral hover:text-coral-deep transition"
      >
        Painel admin
      </Link>
    ) : (
      <Link
        href="/minha-conta"
        className="block w-full rounded-full border border-cream-deep px-5 py-2.5 text-center text-sm text-ink hover:border-coral hover:text-coral-deep transition"
      >
        Minha conta
      </Link>
    )
  ) : (
    <div className="space-y-2">
      <Link
        href="/login"
        className="block w-full rounded-full bg-coral px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-coral-deep transition"
      >
        Entrar
      </Link>
      <Link
        href="/cadastro"
        className="block w-full rounded-full border border-cream-deep px-5 py-2.5 text-center text-sm text-ink hover:border-coral hover:text-coral-deep transition"
      >
        Criar conta
      </Link>
    </div>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-cream-deep/60 bg-cream-soft/95 backdrop-blur">
      {/* Linha 1: barra promocional */}
      <PromoBar />

      {/* Linha 2: brand + busca + icones */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 grid grid-cols-[auto_1fr_auto] gap-3 sm:gap-6 items-center">
        <Link href="/" className="flex items-center gap-2.5 group min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-mark.svg"
            alt=""
            className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 transition group-hover:rotate-[-4deg]"
          />
          <span className="font-display text-base sm:text-xl tracking-tight text-ink truncate">
            perfumes de ambiente <span className="text-coral-deep">decor</span>
          </span>
        </Link>

        {/* Busca: ocupa centro no desktop, escondida no mobile */}
        <div className="hidden md:block">
          <SearchInput className="max-w-xl mx-auto" />
        </div>

        {/* Icones do lado direito */}
        <div className="flex items-center gap-1 sm:gap-2 justify-end">
          {/* WhatsApp / atendimento — apenas desktop */}
          <a
            href={wppHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar pelo WhatsApp"
            className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-soft hover:text-coral-deep hover:bg-cream transition"
            title="Atendimento WhatsApp"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
              <path d="M17.5 14.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.1-.7.1s-.7 1-.9 1.2-.4.2-.7.1c-.3-.1-1.2-.4-2.4-1.5-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5l-.6-.01c-.2 0-.5.07-.8.37-.3.3-1 1-1 2.5s1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.4M12 22h-.01a9.87 9.87 0 0 1-5.03-1.4l-.36-.2-3.74.98 1-3.64-.24-.38A9.86 9.86 0 0 1 2.16 11.9c0-5.45 4.44-9.88 9.89-9.88a9.85 9.85 0 0 1 9.88 9.89c0 5.45-4.44 9.88-9.93 9.88M20.5 3.5A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.94L.06 24l6.31-1.66a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.17-1.24-6.16-3.49-8.4Z" />
            </svg>
          </a>

          {/* Conta */}
          {user ? (
            <Link
              href={user.role === "admin" ? "/admin" : "/minha-conta"}
              aria-label={user.role === "admin" ? "Painel admin" : "Minha conta"}
              className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-soft hover:text-coral-deep hover:bg-cream transition"
              title={user.role === "admin" ? "Painel admin" : "Minha conta"}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
              </svg>
            </Link>
          ) : (
            <Link
              href="/login"
              aria-label="Entrar"
              className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-soft hover:text-coral-deep hover:bg-cream transition"
              title="Entrar"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
              </svg>
            </Link>
          )}

          <CartLink />
          <MobileMenuDrawer userArea={userArea} groups={menuGroups} navItems={navItems} />
        </div>
      </div>

      {/* Busca mobile (segunda linha em telas pequenas) */}
      <div className="md:hidden px-4 pb-3">
        <SearchInput />
      </div>

      {/* Linha 3: nav principal com mega menu (desktop) */}
      <div className="border-t border-cream-deep/40">
        <MegaMenu groups={menuGroups} navItems={navItems} />
      </div>
    </header>
  );
}
