import type { Preview } from "@storybook/nextjs";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    backgrounds: {
      default: "crema",
      values: [
        { name: "crema", value: "#FAF1E6" },
        { name: "arena", value: "#EFDFC4" },
        { name: "cacao", value: "#2B1E16" },
      ],
    },
    a11y: {
      // WCAG 2.1 AA target for App BiT
      config: { rules: [{ id: "color-contrast", enabled: true }] },
    },
  },
};

export default preview;
