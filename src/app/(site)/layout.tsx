import Link from "next/link";
import { CartLink } from "@/components/CartLink";
import { getCurrentUser } from "@/lib/auth/guards";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <>
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-light tracking-tight">
            Luperfumes
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-700">
            <Link href="/produtos" className="hover:text-neutral-900">Catálogo</Link>
            <Link href="/produtos?categoria=difusores" className="hover:text-neutral-900">Difusores</Link>
            <Link href="/produtos?categoria=home-spray" className="hover:text-neutral-900">Home Spray</Link>
            <Link href="/produtos?categoria=sabonetes" className="hover:text-neutral-900">Sabonetes</Link>
            <Link href="/produtos?categoria=kits" className="hover:text-neutral-900">Kits</Link>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              user.role === "admin" ? (
                <Link
                  href="/admin"
                  className="text-sm text-neutral-700 hover:text-neutral-900"
                >
                  Admin
                </Link>
              ) : (
                <Link
                  href="/minha-conta"
                  className="text-sm text-neutral-700 hover:text-neutral-900"
                >
                  Minha conta
                </Link>
              )
            ) : (
              <Link href="/login" className="text-sm text-neutral-700 hover:text-neutral-900">
                Entrar
              </Link>
            )}
            <CartLink />
          </div>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="border-t bg-white mt-16">
        <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <h3 className="font-medium mb-2">Luperfumes</h3>
            <p className="text-neutral-500">Perfumaria de ambiente.</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Loja</h3>
            <ul className="space-y-1 text-neutral-600">
              <li><Link href="/produtos">Catálogo</Link></li>
              <li><Link href="/carrinho">Carrinho</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Ajuda</h3>
            <ul className="space-y-1 text-neutral-600">
              <li><Link href="/trocas-devolucoes">Trocas e devoluções</Link></li>
              <li><Link href="/politica-de-privacidade">Privacidade</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Conta</h3>
            <ul className="space-y-1 text-neutral-600">
              <li><Link href="/login">Entrar</Link></li>
              <li><Link href="/cadastro">Criar conta</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mx-auto max-w-7xl px-6 py-4 text-xs text-neutral-500">
          © {new Date().getFullYear()} Luperfumes. Todos os direitos reservados.
        </div>
      </footer>
    </>
  );
}
