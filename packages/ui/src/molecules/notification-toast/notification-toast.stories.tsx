import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/button";
import { notify, Toaster } from "./notification-toast";

const meta = {
  title: "Molecules/NotificationToast",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Presets: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Toaster position="top-center" />
      <Button
        variant="secondary"
        onClick={() => notify.success("Perfil guardado correctamente.")}
      >
        success (oliva)
      </Button>
      <Button
        variant="secondary"
        onClick={() => notify.info("Tenés una nueva mentoría disponible.")}
      >
        info (azul)
      </Button>
      <Button
        variant="secondary"
        onClick={() => notify.error("No pudimos guardar los cambios.")}
      >
        error (ámbar)
      </Button>
      <Button
        variant="destructive"
        onClick={() =>
          notify.critical("Si estás en crisis, llamá al CVV: 135.")
        }
      >
        critical (granate · CVV)
      </Button>
    </div>
  ),
};
