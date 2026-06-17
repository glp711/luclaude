import { BENEFITS, type Benefit } from "@/lib/home-content";

const ICONS: Record<Benefit["iconKey"], React.ReactNode> = {
  shipping: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      <path d="M16 16V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
      <path d="M16 8h3a2 2 0 0 1 1.8 1.1l1.2 2.4a2 2 0 0 1 .2.9V16a2 2 0 0 1-2 2h-1" />
      <circle cx="9" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  ),
  secure: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  payment: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      <rect x="2" y="6" width="20" height="13" rx="2" />
      <path d="M2 11h20" />
      <path d="M6 15h2" />
    </svg>
  ),
  support: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z" />
    </svg>
  ),
};

export function BenefitsBar() {
  return (
    <section aria-label="Beneficios" className="bg-cream border-b border-cream-deep/40">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BENEFITS.map((b) => (
            <li
              key={b.title}
              className="flex items-start gap-3 rounded-2xl bg-cream-soft border border-cream-deep px-4 py-3"
            >
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-coral-soft/60 text-coral-deep">
                {ICONS[b.iconKey]}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink leading-tight">{b.title}</p>
                <p className="text-xs text-ink-mute leading-snug mt-0.5">{b.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
