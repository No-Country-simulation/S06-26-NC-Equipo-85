import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./spinner";

const meta = {
  title: "Atoms/Spinner",
  component: Spinner,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { size: "md" } };

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-primary">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};

// Sobre superficie clara (crema).
export const OnLight: Story = {
  parameters: { backgrounds: { default: "crema" } },
  render: () => (
    <div className="text-primary">
      <Spinner size="lg" />
    </div>
  ),
};

// Sobre superficie oscura (cacao).
export const OnDark: Story = {
  parameters: { backgrounds: { default: "cacao" } },
  render: () => (
    <div className="text-crema">
      <Spinner size="lg" />
    </div>
  ),
};
