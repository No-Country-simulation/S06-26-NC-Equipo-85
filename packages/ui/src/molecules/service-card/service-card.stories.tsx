import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { GraduationCap, Briefcase, Heart } from "lucide-react";
import { ServiceCard } from "./service-card";

const meta = {
  title: "Molecules/ServiceCard",
  component: ServiceCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: { onAction: fn() },
} satisfies Meta<typeof ServiceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ambar: Story = {
  args: {
    icon: <GraduationCap size={24} />,
    title: "Formaciones",
    description: "Cursos gratuitos de Google y Oracle para cerrar tus brechas de skills.",
    accentColor: "ambar",
  },
};

export const Terracota: Story = {
  args: {
    icon: <Briefcase size={24} />,
    title: "Empleabilidad",
    description: "Vacantes ordenadas por tu compatibilidad real, con el camino para cerrarlas.",
    accentColor: "terracota",
  },
};

export const AzulHorizonte: Story = {
  args: {
    icon: <Heart size={24} />,
    title: "Salud mental",
    description: "Un espacio seguro para tu check-in diario, con acompañamiento empático.",
    accentColor: "azul-horizonte",
  },
};
