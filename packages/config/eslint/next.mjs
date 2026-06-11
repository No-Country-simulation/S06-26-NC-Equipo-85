import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * ESLint config for Next.js apps.
 * Used by apps/web (and any future Next.js app).
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  ...nextVitals,
  ...nextTs,
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];
