import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Supported locales for App BiT (Portuguese, Spanish; English coming later)
  locales: ["es", "pt"],
  // Default locale when none matches
  defaultLocale: "es",
});

export type Locale = (typeof routing.locales)[number];
