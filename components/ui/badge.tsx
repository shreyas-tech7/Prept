import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-amber-500/15 text-amber-400",
        behavioral: "bg-violet-500/20 text-violet-300",
        technical: "bg-cyan-500/20 text-cyan-300",
        situational: "bg-blue-500/20 text-blue-300",
        mixed: "bg-fuchsia-500/20 text-fuchsia-300",
        neutral:
          "bg-[var(--surface-2)] text-[var(--text-secondary)] border border-[var(--border)]",
        success: "bg-emerald-500/15 text-emerald-400",
        warn: "bg-orange-500/15 text-orange-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
