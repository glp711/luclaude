import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Luperfumes — Perfumaria de ambiente", template: "%s · Luperfumes" },
  description: "Difusores, sabonetes e home spray escolhidos a dedo pela LU pra sua casa virar memória.",
  icons: { icon: "/logo-mark.svg" },
  openGraph: {
    title: "Luperfumes",
    description: "Perfumaria de ambiente — aromas que ficam.",
    locale: "pt_BR",
    type: "website",
  },
  formatDetection: { telephone: false },
};

export const viewport = {
  themeColor: "#f5ecdc",
  width: "device-width",
  initialScale: 1,
};

function getStorageHost(): string | null {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return url ? new URL(url).origin : null;
  } catch {
    return null;
  }
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const storageHost = getStorageHost();
  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        {storageHost && (
          <>
            <link rel="preconnect" href={storageHost} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={storageHost} />
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {children}
      </body>
    </html>
  );
}
