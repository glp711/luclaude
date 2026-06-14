import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-cream-deep/60 bg-cream-soft/85 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="flex items-center gap-2 font-display text-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-mark.svg" alt="" className="h-8 w-8" />
              <span className="text-ink">
                Lu<span className="text-coral-deep">perfumes</span>
              </span>
              <span className="text-ink-mute text-sm uppercase tracking-widest ml-2">Admin</span>
            </Link>
            <nav className="hidden md:flex gap-6 text-sm text-ink-soft">
              <Link href="/admin/produtos" className="hover:text-coral-deep transition">Produtos</Link>
              <Link href="/admin/pedidos" className="hover:text-coral-deep transition">Pedidos</Link>
              <Link href="/admin/categorias" className="hover:text-coral-deep transition">Categorias</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm text-ink-soft">
            <Link
              href="/"
              className="hidden md:inline text-xs text-ink-mute hover:text-coral-deep transition"
            >
              Ver loja →
            </Link>
            <span className="hidden sm:inline text-ink-soft">{user.email}</span>
            <form action="/logout" method="post">
              <button
                className="rounded-full border border-cream-deep bg-cream px-4 py-1.5 text-sm hover:border-coral hover:text-coral-deep transition"
                type="submit"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
        <nav className="md:hidden border-t border-cream-deep/60 px-6 py-2 flex gap-5 text-sm text-ink-soft overflow-x-auto">
          <Link href="/admin/produtos" className="hover:text-coral-deep transition whitespace-nowrap">Produtos</Link>
          <Link href="/admin/pedidos" className="hover:text-coral-deep transition whitespace-nowrap">Pedidos</Link>
          <Link href="/admin/categorias" className="hover:text-coral-deep transition whitespace-nowrap">Categorias</Link>
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
