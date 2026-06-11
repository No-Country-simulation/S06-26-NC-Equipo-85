"use client";

import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";

<<<<<<<< HEAD:packages/ui/src/atoms/label/label.tsx
import { cn } from "../../lib/utils";
========
import { cn } from "@appbit/ui/lib/utils"
>>>>>>>> 51bb92f35893b8eb5db168637904bcafd59ee8fa:packages/ui/src/components/ui/label.tsx

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Label };
