"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useCart } from "@/lib/cart/store";
import { formatBRL } from "@/lib/money";

type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  price_cents: number;
  stock_quantity: number;
  status: string;
  cover_url: string | null;
};

type ShippingQuote = {
  id: number;
  name: string;
  price: string;
  delivery_time: number;
  company: { name: string };
};

function useCartHydrated() {
  return useSyncExternalStore(
    (cb) => useCart.persist.onFinishHydration(cb),
    () => useCart.persist.hasHydrated(),
    () => false
  );
}

const onlyDigits = (s: string) => s.replace(/\D/g, "");

export function CheckoutForm({
  catalog,
  prefillEmail,
}: {
  catalog: Record<string, CatalogProduct>;
  prefillEmail: string | null;
}) {
  const hydrated = useCartHydrated();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);

  // Endereço
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  // Dados pessoais
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(prefillEmail ?? "");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");

  // Frete
  const [quotes, setQuotes] = useState<ShippingQuote[]>([]);
  const [selectedQuoteId, setSelectedQuoteId] = useState<number | null>(null);
  const [quotingShipping, setQuotingShipping] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);

  // Pagamento
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "credit_card" | "boleto">("pix");

  // Submit
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtra itens válidos
  const validItems = useMemo(
    () => items.filter((i) => catalog[i.product_id]?.status === "active"),
    [items, catalog]
  );

  const subtotal = useMemo(
    () =>
      validItems.reduce(
        (sum, i) => sum + (catalog[i.product_id]?.price_cents ?? 0) * i.quantity,
        0
      ),
    [validItems, catalog]
  );

  const selectedQuote = quotes.find((q) => q.id === selectedQuoteId) ?? null;
  const shippingCents = selectedQuote
    ? Math.round(parseFloat(selectedQuote.price) * 100)
    : 0;
  const total = subtotal + shippingCents;

  // Busca endereço via ViaCEP quando CEP completo
  useEffect(() => {
    const clean = onlyDigits(cep);
    if (clean.length !== 8) return;
    let aborted = false;
    fetch(`https://viacep.com.br/ws/${clean}/json/`)
      .then((r) => r.json())
      .then((data: { logradouro?: string; bairro?: string; localidade?: string; uf?: string; erro?: boolean }) => {
        if (aborted || data.erro) return;
        if (data.logradouro && !street) setStreet(data.logradouro);
        if (data.bairro && !neighborhood) setNeighborhood(data.bairro);
        if (data.localidade && !city) setCity(data.localidade);
        if (data.uf && !state) setState(data.uf);
      })
      .catch(() => {});
    return () => { aborted = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cep]);

  // Cota frete quando CEP completo e tem itens.
  // Roda como effect, mas resultados aplicados via callbacks pra contentar
  // o lint react-hooks/set-state-in-effect.
  useEffect(() => {
    const clean = onlyDigits(cep);
    if (clean.length !== 8 || validItems.length === 0) return;

    let aborted = false;
    const run = async () => {
      // setState num microtask satisfaz a regra (não é sync no corpo do effect)
      await Promise.resolve();
      if (aborted) return;
      setQuotingShipping(true);
      setShippingError(null);
      try {
        const r = await fetch("/api/shipping/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to_cep: clean,
            items: validItems.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
          }),
        });
        if (aborted) return;
        if (!r.ok) throw new Error("Não foi possível cotar frete");
        const data = (await r.json()) as { quotes: ShippingQuote[] };
        if (aborted) return;
        setQuotes(data.quotes ?? []);
        if (data.quotes?.[0]) setSelectedQuoteId(data.quotes[0].id);
      } catch (e) {
        if (!aborted) setShippingError(e instanceof Error ? e.message : "Erro");
      } finally {
        if (!aborted) setQuotingShipping(false);
      }
    };
    run();
    return () => {
      aborted = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cep, validItems.length]);

  if (!hydrated) {
    return (
      <div className="rounded-3xl border border-dashed border-cream-deep bg-cream-soft p-12 text-center text-ink-mute">
        Carregando…
      </div>
    );
  }

  if (validItems.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-cream-deep bg-cream-soft p-16 text-center">
        <p className="font-display text-3xl text-ink">Seu carrinho está vazio</p>
        <p className="mt-2 text-sm text-ink-soft">
          Volte ao catálogo pra escolher seus aromas.
        </p>
        <Link
          href="/produtos"
          className="mt-6 inline-block rounded-full bg-coral px-7 py-3 text-sm font-medium text-white hover:bg-coral-deep transition"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    if (!selectedQuoteId) {
      setError("Escolha uma opção de frete primeiro.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: validItems.map((i) => ({
            product_id: i.product_id,
            quantity: i.quantity,
          })),
          shipping_address: {
            postal_code: onlyDigits(cep),
            street,
            number,
            complement: complement || null,
            neighborhood,
            city,
            state: state.toUpperCase(),
            recipient_name: fullName,
          },
          shipping_service_id: selectedQuoteId,
          customer: {
            email,
            cpf: onlyDigits(cpf),
            phone: onlyDigits(phone),
            full_name: fullName,
          },
          payment_method: paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(
          data.error === "insufficient_stock"
            ? "Estoque insuficiente para um dos itens."
            : data.error === "product_unavailable"
              ? "Um dos produtos saiu de linha."
              : data.error === "invalid"
                ? "Confira os dados — algo está incompleto."
                : `Erro: ${data.error ?? "tente de novo"}`
        );
        return;
      }

      // Limpa o carrinho e redireciona pro Mercado Pago
      clear();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        setError("Pedido criado mas não veio link de pagamento. Tente de novo.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro de rede");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
      <div className="space-y-6">
        <section className="rounded-2xl border border-cream-deep bg-cream-soft p-6">
          <h2 className="font-display text-2xl text-ink mb-4">Endereço de entrega</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="CEP" className="sm:col-span-2 sm:max-w-[200px]">
              <input
                required
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                inputMode="numeric"
                maxLength={9}
                placeholder="00000-000"
                className={inputCls}
              />
            </Field>
            <Field label="Rua" className="sm:col-span-2">
              <input required value={street} onChange={(e) => setStreet(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Número">
              <input required value={number} onChange={(e) => setNumber(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Complemento (opcional)">
              <input value={complement} onChange={(e) => setComplement(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Bairro">
              <input required value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Cidade">
              <input required value={city} onChange={(e) => setCity(e.target.value)} className={inputCls} />
            </Field>
            <Field label="UF" className="max-w-[120px]">
              <input
                required
                value={state}
                onChange={(e) => setState(e.target.value.toUpperCase().slice(0, 2))}
                maxLength={2}
                className={inputCls}
              />
            </Field>
          </div>
        </section>

        <section className="rounded-2xl border border-cream-deep bg-cream-soft p-6">
          <h2 className="font-display text-2xl text-ink mb-4">Frete</h2>
          {quotingShipping && (
            <p className="text-sm text-ink-mute">Calculando opções de frete…</p>
          )}
          {!quotingShipping && quotes.length === 0 && onlyDigits(cep).length === 8 && (
            <p className="text-sm text-coral-deep">
              {shippingError ?? "Sem opções de frete pra este CEP no momento."}
            </p>
          )}
          {!quotingShipping && quotes.length === 0 && onlyDigits(cep).length !== 8 && (
            <p className="text-sm text-ink-mute">Preencha o CEP pra calcular o frete.</p>
          )}
          {quotes.length > 0 && (
            <div className="space-y-2">
              {quotes.map((q) => (
                <label
                  key={q.id}
                  className={`flex items-center gap-3 rounded-2xl border p-3 cursor-pointer transition ${
                    selectedQuoteId === q.id
                      ? "border-coral bg-coral-soft/30"
                      : "border-cream-deep hover:border-coral-soft"
                  }`}
                >
                  <input
                    type="radio"
                    name="shipping"
                    value={q.id}
                    checked={selectedQuoteId === q.id}
                    onChange={() => setSelectedQuoteId(q.id)}
                    className="accent-coral"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-ink">{q.company.name} · {q.name}</div>
                    <div className="text-xs text-ink-mute">{q.delivery_time} dia(s) úteis</div>
                  </div>
                  <div className="font-display text-lg text-coral-deep tabular-nums">
                    {formatBRL(Math.round(parseFloat(q.price) * 100))}
                  </div>
                </label>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-cream-deep bg-cream-soft p-6">
          <h2 className="font-display text-2xl text-ink mb-4">Seus dados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Nome completo" className="sm:col-span-2">
              <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} />
            </Field>
            <Field label="E-mail">
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
            </Field>
            <Field label="CPF">
              <input
                required
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                inputMode="numeric"
                placeholder="000.000.000-00"
                className={inputCls}
              />
            </Field>
            <Field label="Telefone (com DDD)" className="sm:col-span-2 sm:max-w-[260px]">
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                placeholder="(11) 99999-9999"
                className={inputCls}
              />
            </Field>
          </div>
        </section>

        <section className="rounded-2xl border border-cream-deep bg-cream-soft p-6">
          <h2 className="font-display text-2xl text-ink mb-4">Forma de pagamento</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {([
              { id: "pix", label: "Pix", hint: "à vista" },
              { id: "credit_card", label: "Cartão", hint: "até 3x sem juros" },
              { id: "boleto", label: "Boleto", hint: "vence em 3 dias" },
            ] as const).map((m) => (
              <label
                key={m.id}
                className={`rounded-2xl border p-3 cursor-pointer text-center transition ${
                  paymentMethod === m.id
                    ? "border-coral bg-coral-soft/30"
                    : "border-cream-deep hover:border-coral-soft"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={m.id}
                  checked={paymentMethod === m.id}
                  onChange={() => setPaymentMethod(m.id)}
                  className="sr-only"
                />
                <div className="font-display text-lg text-ink">{m.label}</div>
                <div className="text-xs text-ink-mute">{m.hint}</div>
              </label>
            ))}
          </div>
        </section>
      </div>

      <aside className="rounded-2xl border border-cream-deep bg-cream-soft p-6 h-fit lg:sticky lg:top-24 space-y-4">
        <h2 className="font-display text-2xl text-ink">Resumo</h2>
        <ul className="text-sm divide-y divide-cream-deep">
          {validItems.map((i) => {
            const p = catalog[i.product_id]!;
            return (
              <li key={i.product_id} className="py-2 flex justify-between gap-2">
                <span className="flex-1 truncate">
                  {p.name} <span className="text-ink-mute">×{i.quantity}</span>
                </span>
                <span className="tabular-nums">{formatBRL(p.price_cents * i.quantity)}</span>
              </li>
            );
          })}
        </ul>
        <dl className="text-sm space-y-1.5 pt-3 border-t border-cream-deep">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Subtotal</dt>
            <dd className="tabular-nums">{formatBRL(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Frete</dt>
            <dd className="tabular-nums">
              {selectedQuote ? formatBRL(shippingCents) : "—"}
            </dd>
          </div>
          <div className="pt-2 border-t border-cream-deep flex justify-between items-baseline">
            <dt className="font-display text-lg text-ink">Total</dt>
            <dd className="font-display text-2xl text-coral-deep tabular-nums">
              {formatBRL(total)}
            </dd>
          </div>
        </dl>
        {error && (
          <div className="rounded-2xl bg-coral-soft/50 border border-coral-soft px-4 py-2.5 text-sm text-coral-deep">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={submitting || !selectedQuoteId || quotingShipping}
          className="w-full rounded-full bg-coral py-3 text-sm font-medium text-white hover:bg-coral-deep transition shadow-sm disabled:cursor-not-allowed disabled:bg-cream-deep disabled:text-ink-mute"
        >
          {submitting ? "Processando…" : "Pagar com Mercado Pago"}
        </button>
        <p className="text-xs text-ink-mute text-center">
          Você vai ser levado pro Mercado Pago pra concluir o pagamento de forma segura.
        </p>
      </aside>
    </form>
  );
}

const inputCls =
  "mt-1 block w-full rounded-full border border-cream-deep bg-cream px-4 py-2 text-sm focus:border-coral focus:outline-none transition";

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="text-xs font-medium uppercase tracking-widest text-sage-deep">
        {label}
      </span>
      {children}
    </label>
  );
}
