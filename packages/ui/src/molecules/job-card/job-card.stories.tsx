import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { JobCard } from "./job-card";

const meta = {
  title: "Molecules/JobCard",
  component: JobCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: { onAction: fn() },
} satisfies Meta<typeof JobCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithMatch: Story = {
  args: {
    job: {
      id: "1",
      title: "Desarrolladora Frontend Jr.",
      company: "Tech Andina",
      area: "Tecnología",
      location: "Remoto",
      matchScore: 87,
    },
  },
};

export const WithoutMatch: Story = {
  args: {
    job: {
      id: "2",
      title: "Diseñadora UX",
      company: "Estudio Aurora",
      area: "Diseño",
    },
  },
};
