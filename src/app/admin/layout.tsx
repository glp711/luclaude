import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-semibold tracking-tight">
              Luperfumes <span className="text-neutral-400">·</span> Admin
            </Link>
            <nav className="flex gap-5 text-sm text-neutral-700">
              <Link href="/admin/produtos" className="hover:text-neutral-900">Produtos</Link>
              <Link href="/admin/pedidos" className="hover:text-neutral-900">Pedidos</Link>
              <Link href="/admin/categorias" className="hover:text-neutral-900">Categorias</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm text-neutral-600">
            <span className="hidden sm:inline">{user.email}</span>
            <form action="/logout" method="post">
              <button className="rounded border border-neutral-300 px-3 py-1 hover:bg-neutral-50" type="submit">
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
