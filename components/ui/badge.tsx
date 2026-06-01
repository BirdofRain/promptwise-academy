import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BadgeVariant = "default" | "sage" | "gold" | "muted" | "outline";

const variants: Record<BadgeVariant, string> = {
  default: "bg-navy/10 text-navy",
  sage: "bg-sage/15 text-sage-dark",
  gold: "bg-gold/15 text-gold-dark",
  muted: "bg-cream-dark text-muted",
  outline: "border border-navy/15 text-navy bg-transparent",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium tracking-wide uppercase",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
