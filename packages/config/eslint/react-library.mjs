import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import base from "./base.mjs";

/**
 * ESLint config for React component libraries (no framework coupling).
 * Used by packages/ui.
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  ...base,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
];
