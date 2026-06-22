"use client";

import type { ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { DASHBOARD_MODULES } from "@/data/dashboard-modules";
import { cn } from "@app/ui";

type DashboardShellProps = {
  children: ReactNode;
};

const DASHBOARD_NAV_ITEMS = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "▦",
  },
  ...DASHBOARD_MODULES.map((module) => ({
    title: module.title,
    href: module.href,
    icon: getModuleIcon(module.id),
  })),
];

/**
 * Devuelve un ícono textual estable para navegación.
 *
 * Se evita introducir una dependencia visual nueva en este PR. Si el equipo
 * estandariza Lucide o SVGs compartidos, este mapeo se reemplaza en un único lugar.
 */
function getModuleIcon(moduleId: string) {
  const icons: Record<string, string> = {
    formaciones: "⌂",
    empleabilidad: "▣",
    experiencias: "▶",
    mentorias: "◌",
    salud: "♡",
  };

  return icons[moduleId] ?? "•";
}

/**
 * Evalúa si un item de navegación debe verse activo.
 */
function isActiveRoute(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname.startsWith(href);
}

/**
 * Layout cliente del área privada.
 *
 * Implementa el patrón AppShell del dashboard: sidebar en desktop, topbar y
 * navegación inferior compacta en mobile.
 */
export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto flex min-h-dvh w-full max-w-360">
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r border-border bg-card px-4 py-6 lg:flex lg:flex-col">
          <Link
            href="/dashboard"
            className="mb-8 flex items-center gap-3 px-2"
            aria-label="Ir al dashboard de App BiT"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary font-serif text-lg font-bold text-primary-foreground">
              B
            </span>
            <span className="font-serif text-xl font-semibold">BiT</span>
          </Link>

          <nav aria-label="Navegación principal del dashboard">
            <ul className="space-y-1">
              {DASHBOARD_NAV_ITEMS.map((item) => {
                const isActive = isActiveRoute(pathname, item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isActive &&
                          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                      )}
                    >
                      <span className="flex size-6 items-center justify-center text-base">
                        {item.icon}
                      </span>
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-auto rounded-2xl bg-muted p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                MS
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">Mariana Solís</p>
                <p className="truncate text-xs text-muted-foreground">
                  Frontend · Principiante
                </p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
            <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 lg:hidden"
                aria-label="Ir al dashboard de App BiT"
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary font-serif font-bold text-primary-foreground">
                  B
                </span>
                <span className="font-serif text-lg font-semibold">BiT</span>
              </Link>

              <div className="hidden lg:block">
                <p className="font-serif text-xl font-semibold">Dashboard</p>
              </div>

              <div className="ml-auto flex items-center gap-3">
                <div className="hidden rounded-full bg-ambar-soft px-3 py-1.5 text-xs font-semibold text-(--bit-ambar-text) sm:block">
                  Check-in pendiente
                </div>

                <div
                  aria-label="Selector de idioma"
                  className="flex overflow-hidden rounded-full border border-border text-xs font-semibold"
                >
                  <span className="bg-primary px-2.5 py-1 text-primary-foreground">
                    ES
                  </span>
                  <span className="px-2.5 py-1 text-muted-foreground">PT</span>
                </div>

                <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  MS
                </span>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-8">
            {children}
          </main>
        </div>
      </div>

      <nav
        aria-label="Navegación inferior del dashboard"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 px-2 py-2 backdrop-blur lg:hidden"
      >
        <ul className="mx-auto grid max-w-xl grid-cols-6 gap-1">
          {DASHBOARD_NAV_ITEMS.map((item) => {
            const isActive = isActiveRoute(pathname, item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex min-h-12 flex-col items-center justify-center rounded-xl px-1 text-[10px] font-medium text-muted-foreground transition-colors",
                    isActive && "bg-primary text-primary-foreground",
                  )}
                >
                  <span className="text-base leading-none">{item.icon}</span>
                  <span className="mt-1 max-w-full truncate">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}