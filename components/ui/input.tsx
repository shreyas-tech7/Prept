import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3.5 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus-visible:outline-none focus-visible:border-amber-500/60 focus-visible:ring-2 focus-visible:ring-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
