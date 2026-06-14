"use client";

import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    try {
      // TODO: criar /api/newsletter que salva em tabela newsletter_subscriptions
      // e dispara confirmação opt-in via Resend. Por enquanto guarda localmente
      // pra não perder o e-mail enquanto a integração não está pronta.
      const existing = JSON.parse(localStorage.getItem("luperfumes:newsletter") ?? "[]");
      localStorage.setItem(
        "luperfumes:newsletter",
        JSON.stringify([...existing, { email, at: new Date().toISOString() }])
      );
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl bg-sage-soft/40 border border-sage-soft p-8 md:p-10">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs uppercase tracking-widest text-sage-deep">na sua caixa de entrada</p>
        <h3 className="mt-2 font-display text-3xl text-ink">
          Aromas novos, promoções e dicas
        </h3>
        <p className="mt-2 text-sm text-ink-soft">
          De vez em quando a LU manda novidades direto pro seu e-mail. Sem spam, sem
          letrinha miúda — pode cancelar quando quiser.
        </p>
        {done ? (
          <div className="mt-6 rounded-full bg-coral-soft/60 px-6 py-3 text-sm text-coral-deep">
            ✓ Recebemos! Em breve novidades chegam pra você.
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="flex-1 rounded-full border border-cream-deep bg-cream-soft px-5 py-3 text-sm focus:border-coral focus:outline-none transition"
              aria-label="Seu e-mail"
            />
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-coral px-6 py-3 text-sm font-medium text-white hover:bg-coral-deep transition disabled:opacity-50"
            >
              {submitting ? "Enviando…" : "Quero receber"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
