"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const CAMPAIGN_KEY = "perfumesdecor:campaign-popup:dani-fernandes-v1";
const PREVIEW_VALUE = "popup-dani";
const BLOCKED_PATHS = ["/carrinho", "/checkout", "/pedidos", "/minha-conta"];

function isDaniCampaign(params: URLSearchParams) {
  const promo = params.get("promo")?.toLowerCase();
  if (promo === "dani" || promo === "dani-fernandes") return true;

  return ["utm_campaign", "utm_content", "utm_term", "campaign"]
    .map((key) => params.get(key)?.toLowerCase() ?? "")
    .some((value) => value.includes("dani"));
}

export function CampaignPopup() {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const preview = params.get("preview") === PREVIEW_VALUE;
    const blockedPath = BLOCKED_PATHS.some((path) => window.location.pathname.startsWith(path));

    if (blockedPath || (!preview && !isDaniCampaign(params))) return;
    if (!preview && window.sessionStorage.getItem(CAMPAIGN_KEY)) return;

    const timer = window.setTimeout(() => {
      setOpen(true);
      if (!preview) window.sessionStorage.setItem(CAMPAIGN_KEY, "viewed");
    }, preview ? 350 : 2200);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/55 px-4 py-4 backdrop-blur-[2px] sm:px-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) setOpen(false);
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="campaign-popup-title"
        aria-describedby="campaign-popup-description"
        className="relative grid max-h-[calc(100dvh-2rem)] w-full max-w-[58rem] overflow-y-auto rounded-[8px] border border-cream-deep bg-cream shadow-[0_30px_90px_rgba(45,41,36,0.3)] md:grid-cols-[0.92fr_1.08fr] md:overflow-hidden"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Fechar promoção"
          title="Fechar"
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-cream-deep bg-cream/95 text-2xl leading-none text-ink shadow-sm transition hover:border-coral hover:text-coral-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
        >
          <span aria-hidden="true">×</span>
        </button>

        <div className="relative min-h-52 overflow-hidden border-b border-cream-deep md:min-h-[34rem] md:border-b-0 md:border-r">
          <Image
            src="/hero/dani-fernandes-tenue-banner-2026-06-29.png"
            alt="Produtos Dani Fernandes Tênue em composição floral"
            fill
            priority
            sizes="(max-width: 767px) 100vw, 430px"
            className="object-cover object-[67%_center] md:object-[69%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-cream/5" />
          <div className="absolute bottom-4 left-4 rounded-full border border-white/45 bg-cream/90 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-widest text-sage-deep shadow-sm backdrop-blur-sm">
            seleção da curadoria
          </div>
        </div>

        <div className="flex min-h-0 flex-col justify-center px-6 py-8 sm:px-9 sm:py-10 md:px-11">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-coral-deep">
            Dani Fernandes em destaque
          </p>
          <h2
            id="campaign-popup-title"
            className="mt-3 max-w-md font-display text-[2.35rem] leading-[1.05] text-ink sm:text-[2.8rem]"
          >
            Um gesto de <span className="italic text-coral-deep">aconchego</span> para sua casa.
          </h2>
          <p
            id="campaign-popup-description"
            className="mt-4 max-w-md text-sm leading-relaxed text-ink-soft sm:text-[0.95rem]"
          >
            Descubra difusores, águas perfumadas e presentes Dani Fernandes dentro da nossa curadoria.
          </p>

          <div className="mt-6 border-y border-cream-deep py-4">
            <p className="font-display text-xl text-sage-deep">Frete grátis acima de R$ 250</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-mute">
              Condição válida para entregas em todo o Brasil.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <Link
              href="/produtos?marca=dani-fernandes&utm_source=popup&utm_medium=onsite&utm_campaign=dani_fernandes"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-12 w-full items-center justify-center whitespace-nowrap rounded-full bg-sage-deep px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
            >
              Explorar Dani Fernandes
              <span className="ml-2 text-base" aria-hidden="true">→</span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="min-h-11 w-full px-3 text-sm font-medium text-ink-soft underline decoration-cream-deep underline-offset-4 transition hover:text-coral-deep hover:decoration-coral"
            >
              Continuar navegando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
