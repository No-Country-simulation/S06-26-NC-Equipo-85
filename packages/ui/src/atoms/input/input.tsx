import * as React from "react";

import { cn } from "@app/ui/lib/utils";

const baseInput =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40";

type InputProps = React.ComponentProps<"input"> & {
  /** Mensaje de error: marca el campo como inválido y se vincula por aria-describedby. */
  error?: string;
  /** Mensaje de éxito (oliva), también vinculado por aria-describedby. */
  success?: string;
};

function Input({
  className,
  type,
  error,
  success,
  id,
  "aria-describedby": ariaDescribedBy,
  ...props
}: InputProps) {
  const generatedId = React.useId();
  const message = error ?? success;

  // Sin mensaje: input primitivo (compatibilidad hacia atrás).
  if (!message) {
    return (
      <input
        type={type}
        id={id}
        data-slot="input"
        aria-describedby={ariaDescribedBy}
        className={cn(baseInput, className)}
        {...props}
      />
    );
  }

  const messageId = `${id ?? generatedId}-message`;
  const isError = Boolean(error);

  return (
    <div className="grid gap-1.5">
      <input
        type={type}
        id={id}
        data-slot="input"
        aria-invalid={isError || undefined}
        aria-describedby={cn(messageId, ariaDescribedBy)}
        className={cn(
          baseInput,
          !isError &&
            "border-oliva focus-visible:border-oliva focus-visible:ring-oliva/20",
          className
        )}
        {...props}
      />
      <p
        id={messageId}
        data-slot="input-message"
        className={cn(
          "text-xs font-medium",
          isError ? "text-destructive" : "text-oliva"
        )}
      >
        {message}
      </p>
    </div>
  );
}

export { Input };
export type { InputProps };
