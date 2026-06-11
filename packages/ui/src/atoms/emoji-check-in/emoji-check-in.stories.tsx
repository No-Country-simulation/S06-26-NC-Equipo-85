import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { EmojiCheckIn } from "./emoji-check-in";

const meta = {
  title: "Atoms/EmojiCheckIn",
  component: EmojiCheckIn,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: { onChange: fn() },
  argTypes: {
    size: { control: "select", options: ["sm", "md"] },
  },
} satisfies Meta<typeof EmojiCheckIn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Preselected: Story = {
  args: { defaultValue: "feliz" },
};

// Selección por click.
export const SelectByClick: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const triste = canvas.getByRole("radio", { name: "Triste" });

    await userEvent.click(triste);

    await expect(triste).toHaveAttribute("aria-checked", "true");
    await expect(args.onChange).toHaveBeenCalledWith("triste");
  },
};

// Selección por teclado: foco en el primero, flechas y Enter.
export const SelectByKeyboard: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const feliz = canvas.getByRole("radio", { name: "Feliz" });

    feliz.focus();
    await expect(feliz).toHaveFocus();

    // Dos flechas a la derecha → "triste" (feliz → cansado → triste).
    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    const triste = canvas.getByRole("radio", { name: "Triste" });
    await expect(triste).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await expect(triste).toHaveAttribute("aria-checked", "true");
    await expect(args.onChange).toHaveBeenCalledWith("triste");
  },
};
