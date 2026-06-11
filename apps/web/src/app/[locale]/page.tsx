import { Sparkles } from "lucide-react";
import { setRequestLocale } from "next-intl/server";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-8 bg-background px-6 text-center">
      <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center gap-8 duration-700">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground">
          <Sparkles className="size-4 text-primary" aria-hidden />
          En construcción
        </span>

        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl">
            App <span className="text-primary">BiT</span>
          </h1>
          <p className="text-2xl font-semibold text-foreground sm:text-3xl">
            Próximamente
          </p>
        </div>

        <p className="max-w-md text-balance text-base text-muted-foreground sm:text-lg">
          Orientación personal para grupos sub-representados en tecnología.
          Estamos trabajando para lanzar muy pronto.
        </p>

        <div className="h-1 w-24 rounded-full bg-primary/20" role="presentation">
          <div className="h-1 w-1/3 animate-pulse rounded-full bg-primary" />
        </div>
      </div>

      <footer className="absolute bottom-6 text-xs text-muted-foreground">
        No Country · S06-26 · Equipo 85
      </footer>
    </main>
  );
}
