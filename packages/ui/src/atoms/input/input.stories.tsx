import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Input } from "./input";

const meta = {
  title: "Atoms/Input",
  component: Input,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: "tu@correo.com", "aria-label": "Correo" },
};

export const Error: Story = {
  args: {
    "aria-label": "Correo",
    defaultValue: "correo-invalido",
    error: "Ingresá un correo válido.",
  },
  // Verifica la asociación accesible mensaje ↔ input.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Correo");
    const message = canvas.getByText("Ingresá un correo válido.");

    await expect(input).toHaveAttribute("aria-invalid", "true");
    const describedBy = input.getAttribute("aria-describedby");
    await expect(describedBy).toBeTruthy();
    await expect(describedBy).toContain(message.id);
  },
};

export const Success: Story = {
  args: {
    "aria-label": "Usuario",
    defaultValue: "ana.bit",
    success: "Nombre de usuario disponible.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Usuario");
    const message = canvas.getByText("Nombre de usuario disponible.");

    await expect(input).not.toHaveAttribute("aria-invalid", "true");
    await expect(input.getAttribute("aria-describedby")).toContain(message.id);
  },
};
