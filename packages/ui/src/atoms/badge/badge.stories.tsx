import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";

const meta = {
  title: "Atoms/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "success",
        "warning",
        "destructive",
        "outline",
      ],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Nuevo", variant: "default" } };
export const Secondary: Story = {
  args: { children: "Ámbar", variant: "secondary" },
};
// success → oliva (BiT)
export const Success: Story = {
  args: { children: "Completado", variant: "success" },
};
// warning → ámbar con texto cacao (nunca blanco)
export const Warning: Story = {
  args: { children: "Pendiente", variant: "warning" },
};
// destructive → granate (reservado a CVV / errores críticos)
export const Destructive: Story = {
  args: { children: "Crítico", variant: "destructive" },
};
export const Outline: Story = {
  args: { children: "Etiqueta", variant: "outline" },
};

export const AllVariants: Story = {
  args: { children: "Badge" },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};
