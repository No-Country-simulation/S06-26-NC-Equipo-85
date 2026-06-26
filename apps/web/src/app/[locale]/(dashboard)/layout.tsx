import type { ReactNode } from "react";
import { AuthGuard } from "@/features/auth/components/auth-guard";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";

type DashboardLayoutProps = Readonly<{
  children: ReactNode;
}>;

/**
 * Layout del grupo dashboard.
 *
 * `AuthGuard` protege el área privada (redirige a `/login` sin sesión). Delega
 * la interactividad de navegación activa y bottom-nav mobile al DashboardShell
 * cliente, manteniendo este layout como Server Component.
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthGuard>
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  );
}