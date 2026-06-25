import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Inbox } from "lucide-react";
import { EmptyState } from "./empty-state";

const meta = {
  title: "Molecules/EmptyState",
  component: EmptyState,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Sin resultados",
  },
};

export const WithDescription: Story = {
  args: {
    icon: <Inbox className="size-10" />,
    title: "Aún no hay nada por aquí",
    description: "Ajustá los filtros o volvé a intentarlo en unos minutos.",
  },
};

export const WithAction: Story = {
  args: {
    icon: <Inbox className="size-10" />,
    title: "No encontramos formaciones",
    description: "Probá quitar algún filtro para ver más opciones.",
    action: { label: "Limpiar filtros", onClick: fn() },
  },
};
