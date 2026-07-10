import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { CourseCard } from "./course-card";

const meta = {
  title: "Molecules/CourseCard",
  component: CourseCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: { onAction: fn() },
} satisfies Meta<typeof CourseCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Available: Story = {
  args: {
    course: {
      id: "1",
      title: "Fundamentos de JavaScript",
      provider: "Platzi",
      level: "principiante",
      status: "disponible",
    },
  },
};

export const InProgress: Story = {
  args: {
    course: {
      id: "2",
      title: "React desde cero",
      provider: "Coderhouse",
      level: "intermedio",
      status: "en-progreso",
    },
  },
};

export const Completed: Story = {
  args: {
    course: {
      id: "3",
      title: "Diseño de interfaces",
      provider: "Google",
      level: "avanzado",
      status: "completado",
    },
  },
};
