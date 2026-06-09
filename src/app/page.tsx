export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h1 className="text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl">
          Luperfumes
        </h1>
        <p className="mt-4 text-neutral-600">
          Perfumaria de ambiente. Em construção.
        </p>
        <div className="mt-10 flex justify-center gap-4 text-sm">
          <a
            href="/produtos"
            className="rounded-full bg-neutral-900 px-6 py-2 text-white hover:bg-neutral-700"
          >
            Ver catálogo
          </a>
          <a
            href="/admin"
            className="rounded-full border border-neutral-300 px-6 py-2 hover:bg-white"
          >
            Entrar (admin)
          </a>
        </div>
      </section>
    </main>
  );
}
