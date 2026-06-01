import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Badge } from "@/components/ui/badge";
import type { PromptCard as PromptCardType } from "@/content/prompt-library";
import { promptCategories } from "@/content/prompt-library";

export function PromptCardItem({ card }: { card: PromptCardType }) {
  const categoryLabel =
    promptCategories.find((c) => c.id === card.category)?.label ?? card.category;

  return (
    <Card className="flex flex-col">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge variant="sage">{categoryLabel}</Badge>
        {card.tags?.slice(0, 2).map((tag) => (
          <Badge key={tag} variant="muted">
            {tag}
          </Badge>
        ))}
      </div>
      <CardTitle>{card.title}</CardTitle>
      <CardDescription className="mt-2 flex-1">{card.description}</CardDescription>
      <pre className="mt-4 max-h-40 overflow-auto rounded-lg bg-cream-dark p-3 text-xs leading-relaxed text-navy">
        {card.prompt.slice(0, 280)}
        {card.prompt.length > 280 ? "…" : ""}
      </pre>
      <div className="mt-4">
        <CopyButton text={card.prompt} />
      </div>
    </Card>
  );
}
