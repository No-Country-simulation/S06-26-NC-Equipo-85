import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoodBanner } from "./mood-banner";

const meta = {
  title: "Molecules/MoodBanner",
  component: MoodBanner,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    mood: {
      control: "select",
      options: ["feliz", "cansado", "triste", "ansioso", "sobrecargado"],
    },
  },
} satisfies Meta<typeof MoodBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Feliz: Story = { args: { mood: "feliz" } };
export const Cansado: Story = { args: { mood: "cansado" } };
export const Triste: Story = { args: { mood: "triste" } };
export const Ansioso: Story = { args: { mood: "ansioso" } };
export const Sobrecargado: Story = { args: { mood: "sobrecargado" } };

export const AllMoods: Story = {
  args: { mood: "feliz" },
  render: () => (
    <div className="grid max-w-md gap-3">
      <MoodBanner mood="feliz" />
      <MoodBanner mood="cansado" />
      <MoodBanner mood="triste" />
      <MoodBanner mood="ansioso" />
      <MoodBanner mood="sobrecargado" />
    </div>
  ),
};
