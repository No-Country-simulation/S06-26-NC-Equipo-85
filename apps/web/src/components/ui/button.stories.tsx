import type { Meta, StoryObj } from "@storybook/nextjs";
import { Button } from "./button";

const meta = {
  title: "Atoms/Button",
  component: Button,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "ghost",
        "destructive",
        "outline",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// primary → terracota (BiT)
export const Primary: Story = {
  args: { children: "Continuar", variant: "default" },
};

// secondary → ámbar (BiT)
export const Secondary: Story = {
  args: { children: "Ver más", variant: "secondary" },
};

export const Ghost: Story = {
  args: { children: "Cancelar", variant: "ghost" },
};

// destructive → granate (BiT, reservado a errores críticos / CVV)
export const Destructive: Story = {
  args: { children: "Eliminar", variant: "destructive" },
};

export const AllVariants: Story = {
  args: { children: "Button" },
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="default">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
    </div>
  ),
};
