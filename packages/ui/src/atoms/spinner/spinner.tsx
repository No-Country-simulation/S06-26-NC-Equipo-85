import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@app/ui/lib/utils";

const spinnerVariants = cva("animate-spin text-current", {
  variants: {
    size: {
      sm: "size-4",
      md: "size-6",
      lg: "size-8",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type SpinnerProps = React.ComponentProps<"span"> &
  VariantProps<typeof spinnerVariants> & {
    /** Texto leído por lectores de pantalla. Default en ES. */
    label?: string;
  };

function Spinner({
  className,
  size,
  label = "Cargando…",
  ...props
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      data-slot="spinner"
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      <Loader2 className={cn(spinnerVariants({ size }))} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export { Spinner, spinnerVariants };
export type { SpinnerProps };
