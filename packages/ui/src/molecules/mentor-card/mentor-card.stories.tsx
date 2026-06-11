import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { MentorCard } from "./mentor-card";

const meta = {
  title: "Molecules/MentorCard",
  component: MentorCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: { onAction: fn() },
} satisfies Meta<typeof MentorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Available: Story = {
  args: {
    mentor: {
      id: "1",
      name: "Lucía Fernández",
      role: "Ingeniera de Software · Mercado Libre",
      available: true,
      availability: "Lun y Mié, tardes",
    },
  },
};

export const Unavailable: Story = {
  args: {
    mentor: {
      id: "2",
      name: "Diego Ramírez",
      role: "Product Designer",
      available: false,
    },
  },
};
