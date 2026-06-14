import Link from "next/link";
import { CartLink } from "@/components/CartLink";
import { MobileNav } from "@/components/MobileNav";
import { getCurrentUser } from "@/lib/auth/guards";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

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
    <>
      <header className="sticky top-0 z-30 border-b border-cream-deep/60 bg-cream-soft/85 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 group min-w-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-mark.svg"
              alt=""
              className="h-10 w-10 flex-shrink-0 transition group-hover:rotate-[-4deg]"
            />
            <span className="font-display text-xl sm:text-2xl tracking-tight text-ink truncate">
              Lu<span className="text-coral-deep">perfumes</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm text-ink-soft">
            <Link href="/produtos" className="hover:text-coral-deep transition">Catálogo</Link>
            <Link href="/produtos?categoria=difusores" className="hover:text-coral-deep transition">Difusores</Link>
            <Link href="/produtos?categoria=home-spray" className="hover:text-coral-deep transition">Home Spray</Link>
            <Link href="/produtos?categoria=sabonetes" className="hover:text-coral-deep transition">Sabonetes</Link>
            <Link href="/produtos?categoria=kits" className="hover:text-coral-deep transition">Kits</Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:block">
              {user ? (
                user.role === "admin" ? (
                  <Link
                    href="/admin"
                    className="text-sm text-ink-soft hover:text-coral-deep transition"
                  >
                    Admin
                  </Link>
                ) : (
                  <Link
                    href="/minha-conta"
                    className="text-sm text-ink-soft hover:text-coral-deep transition"
                  >
                    Minha conta
                  </Link>
                )
              ) : (
                <Link href="/login" className="text-sm text-ink-soft hover:text-coral-deep transition">
                  Entrar
                </Link>
              )}
            </div>
            <CartLink />
            <MobileNav userArea={userArea} />
          </div>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="mt-24 border-t border-cream-deep/60 bg-cream-soft">
        <div className="mx-auto max-w-7xl px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-mark.svg" alt="" className="h-9 w-9" />
              <span className="font-display text-xl text-ink">Luperfumes</span>
            </div>
            <p className="text-ink-soft leading-relaxed max-w-xs">
              Perfumaria de ambiente, feita pra deixar memória em cada cantinho da sua casa.
            </p>
            <a
              href="https://www.instagram.com/perfumesdeambientedecor/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-xs text-ink-soft hover:text-coral-deep transition"
            >
              <span>📷</span> @perfumesdeambientedecor
            </a>
          </div>
          <div>
            <h3 className="font-display text-lg text-ink mb-3">Loja</h3>
            <ul className="space-y-2 text-ink-soft">
              <li><Link href="/produtos" className="hover:text-coral-deep transition">Catálogo</Link></li>
              <li><Link href="/produtos?categoria=difusores" className="hover:text-coral-deep transition">Difusores</Link></li>
              <li><Link href="/produtos?categoria=home-spray" className="hover:text-coral-deep transition">Home Spray</Link></li>
              <li><Link href="/carrinho" className="hover:text-coral-deep transition">Carrinho</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-lg text-ink mb-3">Ajuda</h3>
            <ul className="space-y-2 text-ink-soft">
              <li><Link href="/trocas-devolucoes" className="hover:text-coral-deep transition">Trocas e devoluções</Link></li>
              <li><Link href="/politica-de-privacidade" className="hover:text-coral-deep transition">Privacidade</Link></li>
              <li><Link href="/contato" className="hover:text-coral-deep transition">Contato</Link></li>
              <li><Link href="/sobre" className="hover:text-coral-deep transition">Sobre a Lu</Link></li>
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
            <span>© {new Date().getFullYear()} Luperfumes — Todos os direitos reservados.</span>
            <span className="italic font-display text-base text-coral-deep">por LU</span>
          </div>
        </div>
      </footer>
    </>
  );
}
