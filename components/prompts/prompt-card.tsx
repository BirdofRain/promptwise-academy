import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Badge } from "@/components/ui/badge";
import type { PromptCard as PromptCardType } from "@/content/prompt-library";
import {
  difficultyLabels,
  promptCategories,
} from "@/content/prompt-library";
import { promptLabUrlForCard } from "@/lib/prompt-lab-import";

const difficultyVariant: Record<
  PromptCardType["difficulty"],
  "sage" | "gold" | "default"
> = {
  beginner: "sage",
  guided: "gold",
  advanced: "default",
};

export function PromptCardItem({ card }: { card: PromptCardType }) {
  const categoryLabel =
    promptCategories.find((c) => c.id === card.category)?.label ?? card.category;

  return (
    <Card
      className={`flex flex-col ${card.comingSoon ? "opacity-80" : ""}`}
      padding="lg"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge variant="outline">{categoryLabel}</Badge>
        <Badge variant={difficultyVariant[card.difficulty]}>
          {difficultyLabels[card.difficulty]}
        </Badge>
        {card.comingSoon && <Badge variant="muted">Coming soon</Badge>}
      </div>
      <CardTitle className="text-xl">{card.title}</CardTitle>
      <CardDescription className="mt-2 flex-1 text-base">{card.description}</CardDescription>
      {!card.comingSoon && (
        <>
          <pre className="mt-4 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-cream-dark p-4 text-base leading-relaxed text-navy">
            {card.prompt}
          </pre>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={promptLabUrlForCard(card.id)}
              className="inline-flex min-h-[3rem] flex-1 items-center justify-center gap-2 rounded-lg bg-sage px-5 py-3 text-lg font-medium text-cream shadow-sm transition-colors hover:bg-sage-dark sm:flex-none sm:min-w-[14rem]"
            >
              <FlaskConical className="h-5 w-5" aria-hidden />
              Customize in Prompt Lab
            </Link>
            <CopyButton text={card.prompt} label="Copy as-is" className="sm:flex-1" />
          </div>
          <p className="mt-2 text-sm text-muted">
            Customize opens this prompt in Prompt Lab so you can add your details before copying.
          </p>
        </>
      )}
    </Card>
  );
}
