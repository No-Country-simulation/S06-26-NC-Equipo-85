import { Check } from "lucide-react";

type AuthCardProps = {
  brand: {
    title: string;
    /** Texto de apoyo (login). Mutuamente excluyente con `bullets` en el diseño. */
    subtitle?: string;
    /** Lista de beneficios con check (registro). */
    bullets?: readonly string[];
  };
  /** Formulario de la vista (login o registro). */
  children: React.ReactNode;
};

/**
 * Shell de las vistas de autenticación: panel de marca (gradiente cálido) a la
 * izquierda + panel de formulario a la derecha. Presentacional y agnóstico de
 * la vista; el copy llega por `brand` y el form por `children`.
 *
 * El panel de marca se oculta en mobile (el formulario ocupa todo el ancho).
 */
export function AuthCard({ brand, children }: AuthCardProps) {
  return (
    <section className="grid overflow-hidden rounded-3xl bg-card shadow-xl ring-1 ring-foreground/5 md:grid-cols-2">
      <div
        className="hidden flex-col justify-between p-10 text-white md:flex"
        style={{
          background:
            "linear-gradient(150deg, var(--bit-terracota), var(--bit-coral) 70%, var(--bit-ambar))",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 font-heading text-base font-bold">
            B
          </div>
          <span className="font-heading text-lg font-semibold">BiT</span>
        </div>

        <div className="mt-8">
          <h2 className="mb-5 font-heading text-2xl font-semibold leading-tight">
            {brand.title}
          </h2>

          {brand.subtitle ? (
            <p className="text-sm leading-relaxed opacity-90">
              {brand.subtitle}
            </p>
          ) : null}

          {brand.bullets ? (
            <ul className="flex flex-col gap-3.5 text-sm">
              {brand.bullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-2.5">
                  <Check className="size-4 shrink-0" aria-hidden />
                  {bullet}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="p-8 sm:p-10">{children}</div>
    </section>
  );
}
