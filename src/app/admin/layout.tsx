import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";

const ADMIN_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/produtos", label: "Produtos" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/financeiro", label: "Financeiro" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/guia", label: "Guia" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-[#f7f1e7] text-ink">
      <header className="sticky top-0 z-30 border-b border-ink/15 bg-ink text-cream-soft shadow-lg shadow-ink/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/admin" className="flex min-w-0 items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.svg" alt="" className="h-10 w-10 shrink-0 rounded-full bg-cream-soft p-1" />
            <span className="min-w-0">
              <span className="block truncate font-display text-xl leading-none text-cream-soft sm:text-2xl">
                perfumes de ambiente <span className="text-coral">decor</span>
              </span>
              <span className="mt-1 block text-xs font-semibold uppercase tracking-widest text-cream-deep/80">
                Painel administrativo
              </span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2 text-sm text-cream-deep">
            <Link
              href="/"
              className="hidden rounded-full border border-cream-soft/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-cream-deep transition hover:border-coral hover:text-coral sm:inline"
            >
              Ver loja
            </Link>
            <span className="hidden max-w-[220px] truncate text-xs text-cream-deep/80 lg:inline">
              {user.email}
            </span>
            <form action="/logout" method="post">
              <button
                className="rounded-full bg-coral px-4 py-2 text-sm font-semibold text-ink transition hover:bg-coral-soft"
                type="submit"
              >
                Sair
              </button>
            </form>
          </div>
        </div>

        <nav className="border-t border-cream-soft/10 bg-ink/95">
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
            {ADMIN_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap rounded-full border border-cream-soft/15 bg-cream-soft/5 px-4 py-2 text-sm font-semibold text-cream-soft transition hover:border-coral hover:bg-coral hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">{children}</main>
    </div>
  );
}
