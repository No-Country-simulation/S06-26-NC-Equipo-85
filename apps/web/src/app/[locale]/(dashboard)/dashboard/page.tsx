import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { DashboardHome } from "@/features/dashboard/components/dashboard-home";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Resumen de progreso, orientación y módulos principales de BiT.",
};

type DashboardPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

/**
 * Página server-first del dashboard.
 *
 * La lectura de estado persistido y la UI dinámica viven dentro de DashboardHome.
 */
export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return <DashboardHome />;
}