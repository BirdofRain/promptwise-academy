import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Badge } from "@/components/ui/badge";
import type { PromptCard as PromptCardType } from "@/content/prompt-library";
import {
  difficultyLabels,
  promptCategories,
} from "@/content/prompt-library";

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
          <div className="mt-5">
            <CopyButton text={card.prompt} label="Copy prompt" />
          </div>
        </>
      )}
    </Card>
  );
}
