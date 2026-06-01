import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  children,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-2 text-sm font-medium tracking-widest text-sage-dark uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-3xl leading-tight text-navy md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-lg leading-relaxed text-muted">{description}</p>
      )}
      {children}
    </div>
  );
}
