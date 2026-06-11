import React from "react";
import type { Preview, Decorator } from "@storybook/react-vite";
import "./preview.css";

// Decorator global de tema: aplica las variables de tipografía, el color base
// y un padding cómodo para todas las stories.
const withTheme: Decorator = (Story) =>
  React.createElement(
    "div",
    { className: "font-sans text-foreground p-6" },
    React.createElement(Story),
  );

const preview: Preview = {
  decorators: [withTheme],
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
      // Objetivo WCAG 2.1 AA para App BiT.
      config: { rules: [{ id: "color-contrast", enabled: true }] },
    },
  },
};

export default preview;
