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
    <main className="min-h-dvh bg-background px-4 py-10 text-foreground sm:px-6 lg:py-14">
      <div className="mx-auto w-full max-w-2xl">
        <OnboardingWizard />
      </div>
    </main>
  );
}