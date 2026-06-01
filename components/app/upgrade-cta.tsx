"use client";

import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface UpgradeCTAProps {
  title?: string;
  description?: string;
  className?: string;
}

export function UpgradeCTA({
  title = "Unlock the full academy",
  description = "Get every lesson, the full prompt library, Prompt Lab, and Master Prompt Builder.",
  className,
}: UpgradeCTAProps) {
  return (
    <Card padding="lg" className={`border-gold/30 bg-gold/10 ${className ?? ""}`}>
      <h2 className="font-serif text-2xl text-navy">{title}</h2>
      <p className="mt-3 text-lg text-muted">{description}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/pricing" size="lg">
          View pricing & subscribe
        </ButtonLink>
        <Link
          href="/app/prompts"
          className="inline-flex min-h-[3.25rem] items-center justify-center rounded-lg px-6 text-lg font-medium text-sage-dark underline"
        >
          Browse free samples
        </Link>
      </div>
    </Card>
  );
}
