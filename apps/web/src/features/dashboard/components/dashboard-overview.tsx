"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@app/ui";
import { useUserStore } from "@/store/user-store";

/**
 * Resumen cliente del dashboard.
 *
 * Lee el resultado persistido de orientación generado al finalizar el onboarding.
 */
export function DashboardOverview() {
  const profile = useUserStore((state) => state.profile);
  const orientationResult = useUserStore((state) => state.orientationResult);

  if (!orientationResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Orientación inicial</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">
            Todavía no hay una orientación generada. Completá el onboarding para
            ver tu gap porcentual, trayectoria sugerida y vacantes compatibles.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="space-y-6" aria-labelledby="orientation-summary-title">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle id="orientation-summary-title">
                Orientación inicial
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {profile?.name
                  ? `Resumen personalizado para ${profile.name}.`
                  : "Resumen personalizado del perfil."}
              </p>
            </div>

            <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {orientationResult.source === "mock" ? "Mock dev" : "API real"}
            </span>
          </div>
        </CardHeader>

        <CardContent className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="rounded-xl border bg-background p-5">
            <p className="text-sm font-medium text-muted-foreground">
              Gap porcentual
            </p>
            <p className="mt-3 text-5xl font-semibold text-primary">
              {orientationResult.gapPercentage}%
            </p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Diferencia estimada entre el perfil actual y los requisitos del
              objetivo declarado.
            </p>
          </div>

          <div className="rounded-xl border bg-background p-5">
            <h3 className="font-semibold text-foreground">
              Trayectoria sugerida
            </h3>

            <ol className="mt-4 space-y-3">
              {orientationResult.suggestedPath.map((item, index) => (
                <li className="flex gap-3" key={`${item}-${index}`}>
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {item}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="mb-3 text-lg font-semibold text-foreground">
          Vacantes compatibles
        </h3>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {orientationResult.compatibleJobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">{job.title}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {job.company}
                    </p>
                  </div>

                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    {job.matchScore}%
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm font-medium text-foreground">
                  Requisitos pendientes
                </p>

                <ul className="mt-2 space-y-1">
                  {job.missingRequirements.map((requirement) => (
                    <li
                      className="text-sm text-muted-foreground"
                      key={requirement}
                    >
                      · {requirement}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}