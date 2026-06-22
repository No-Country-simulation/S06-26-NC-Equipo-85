import type { ReactNode } from "react";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";

type DashboardLayoutProps = Readonly<{
  children: ReactNode;
}>;

/**
 * Layout del grupo dashboard.
 *
 * Delega la interactividad de navegación activa y bottom-nav mobile al
 * DashboardShell cliente, manteniendo este layout como Server Component.
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <DashboardShell>{children}</DashboardShell>;
}