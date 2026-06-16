import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { OnboardingWizard } from "@/features/onboarding/components/onboarding-wizard";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Completá tu perfil inicial para recibir orientación en App BiT.",
};

type OnboardingPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

/**
 * Página server-first del onboarding.
 *
 * La interactividad vive en OnboardingWizard para evitar marcar toda la ruta
 * como Client Component.
 */
export default async function OnboardingPage({ params }: OnboardingPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <main className="min-h-dvh bg-background px-4 py-10 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <section className="mb-8 max-w-3xl space-y-3">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">
            Fase 2 · Perfil inicial
          </p>

          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Construí tu orientación personalizada
          </h1>

          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            Este flujo guarda un borrador local del perfil para que puedas
            retomarlo si cerrás el navegador antes de terminar.
          </p>
        </section>

        <OnboardingWizard />
      </div>
    </main>
  );
}