import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Fraunces, Inter } from "next/font/google";
import { Toaster } from "sonner";
import { routing, type Locale } from "@/i18n/routing";
import { StoreHydration } from "@/components/store-hydration";
import { AxeCore } from "@/components/axe-core";
import "../globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "App BiT — Orientación Personal",
    template: "%s | App BiT",
  },
  description:
    "App BiT: orientación personal para grupos sub-representados en tecnología.",
  openGraph: {
    title: "App BiT — Orientación Personal",
    description:
      "App BiT: orientación personal para grupos sub-representados en tecnología.",
    type: "website",
    siteName: "App BiT",
  },
  twitter: {
    card: "summary_large_image",
    title: "App BiT",
    description:
      "Orientación personal para grupos sub-representados en tecnología.",
  },
  robots: { index: true, follow: true },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Reject unsupported locales
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering for this locale
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <StoreHydration />
        {process.env.NODE_ENV === "development" && <AxeCore />}
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--bit-crema)",
              color: "var(--bit-cacao)",
              border: "1px solid var(--bit-arena)",
            },
          }}
        />
      </body>
    </html>
  );
}
