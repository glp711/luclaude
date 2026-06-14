"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const OPTIONS = [
  { value: "recent", label: "Mais recentes" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "name", label: "A → Z" },
];

export function SortSelect({ current }: { current: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  return (
    <select
      value={current}
      onChange={(e) => {
        const next = new URLSearchParams(sp.toString());
        if (e.target.value === "recent") next.delete("sort");
        else next.set("sort", e.target.value);
        next.delete("page");
        const qs = next.toString();
        router.push(`${pathname}${qs ? `?${qs}` : ""}`);
      }}
      className="rounded-full border border-cream-deep bg-cream-soft px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-coral transition"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
