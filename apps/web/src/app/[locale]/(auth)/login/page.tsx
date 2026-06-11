import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@app/ui";

function LoginForm() {
  const t = useTranslations("common");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-primary">App BiT</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm">
          {t("nav.dashboard")} · Placeholder de autenticación
        </p>
        <Button className="w-full">{t("buttons.login")}</Button>
      </CardContent>
    </Card>
  );
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LoginForm />;
}
