import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-navy text-cream hover:bg-navy-light shadow-sm border border-transparent",
  secondary:
    "bg-sage text-cream hover:bg-sage-dark shadow-sm border border-transparent",
  ghost: "bg-transparent text-navy hover:bg-cream-dark",
  outline:
    "bg-transparent text-navy border border-navy/20 hover:border-navy/40 hover:bg-cream-dark",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-4 py-2.5 text-base min-h-[2.75rem]",
  md: "px-5 py-3 text-lg min-h-[3rem]",
  lg: "px-6 py-3.5 text-lg min-h-[3.25rem]",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {children}
    </Link>
  );
}
