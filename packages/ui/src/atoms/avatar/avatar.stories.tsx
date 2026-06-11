import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const meta = {
  title: "Atoms/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage
        src="https://i.pravatar.cc/96?img=47"
        alt="Foto de perfil de Ana"
      />
      <AvatarFallback>AN</AvatarFallback>
    </Avatar>
  ),
};

// Fallback de iniciales cuando no hay imagen.
export const InitialsFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="" alt="" />
      <AvatarFallback>MJ</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar className="size-7">
        <AvatarFallback>S</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>M</AvatarFallback>
      </Avatar>
      <Avatar className="size-12">
        <AvatarFallback>L</AvatarFallback>
      </Avatar>
    </div>
  ),
};
