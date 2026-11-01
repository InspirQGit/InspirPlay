import * as React from "react";

import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full resize-none rounded-lg border border-input bg-input-background px-3 py-2.5 text-base text-foreground shadow-[var(--shadow-control)] outline-none transition-[color,border-color,box-shadow] field-sizing-content placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/35 focus-visible:ring-[3px] aria-invalid:border-destructive aria-invalid:ring-destructive/20 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
