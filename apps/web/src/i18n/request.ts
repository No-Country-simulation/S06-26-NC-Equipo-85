import { getRequestConfig } from "next-intl/server";
import { routing, type Locale } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale comes from the [locale] segment
  let locale = await requestLocale;

  // Fall back to default locale if missing or unsupported
  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  // Translations live in public/locales/<locale>/common.json (namespaced as "common")
  const common = (await import(`../../public/locales/${locale}/common.json`))
    .default;

  return {
    locale,
    messages: { common },
  };
});
