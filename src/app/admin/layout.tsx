import { requireAdmin } from "@/lib/auth/guards";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center gap-6">
          <a href="/admin" className="font-semibold">Luperfumes · Admin</a>
          <nav className="flex gap-4 text-sm text-neutral-700">
            <a href="/admin/produtos" className="hover:underline">Produtos</a>
            <a href="/admin/pedidos" className="hover:underline">Pedidos</a>
            <a href="/admin/categorias" className="hover:underline">Categorias</a>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
