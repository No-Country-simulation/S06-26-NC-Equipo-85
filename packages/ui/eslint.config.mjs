import { defineConfig } from "eslint/config";
import baseConfig from "@app/config/eslint";

const eslintConfig = defineConfig([
  { ignores: ["storybook-static/**", "dist/**", ".turbo/**"] },
  ...baseConfig,
  {
    rules: {
      "no-html-link-for-pages": "off",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["next", "next/*", "next-intl", "next-intl/*"],
              message:
                "@app/ui must stay framework-agnostic: do not import from Next.js or next-intl. Pass data, navigation and translations in via props.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
