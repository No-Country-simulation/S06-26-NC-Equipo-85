import js from "@eslint/js";
import tseslint from "typescript-eslint";

/**
 * Shared base ESLint config (framework-agnostic).
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["dist/**", "node_modules/**", ".turbo/**"],
  },
];
