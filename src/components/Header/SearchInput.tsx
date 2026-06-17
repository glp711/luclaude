"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchInput({
  className = "",
  inputClassName = "",
  placeholder = "Buscar fragrancia, marca, produto...",
}: {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [value, setValue] = useState(sp.get("busca") ?? "");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = value.trim();
    router.push(term ? `/produtos?busca=${encodeURIComponent(term)}` : "/produtos");
  };

  return (
    <form
      role="search"
      onSubmit={submit}
      className={`relative flex items-center ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-4 text-ink-mute"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </span>
      <input
        type="search"
        name="busca"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Buscar produtos"
        className={`w-full rounded-full border border-cream-deep bg-cream-soft pl-11 pr-4 py-2.5 text-sm placeholder:text-ink-mute focus:outline-none focus:border-coral focus:ring-1 focus:ring-coral/40 transition ${inputClassName}`}
      />
    </form>
  );
}
