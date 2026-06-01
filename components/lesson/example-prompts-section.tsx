import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Badge } from "@/components/ui/badge";
import type { PromptCard } from "@/content/prompt-library";
import { difficultyLabels } from "@/content/prompt-library";

export function ExamplePromptsSection({ prompts }: { prompts: PromptCard[] }) {
  if (prompts.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl text-navy">Example prompts</h2>
      <p className="mt-2 text-lg text-muted">
        Copy any prompt below, then paste it into ChatGPT. You can always ask ChatGPT to
        adjust the tone or length.
      </p>
      <div className="mt-6 space-y-6">
        {prompts.map((prompt) => (
          <Card key={prompt.id} padding="lg">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="sage">{difficultyLabels[prompt.difficulty]}</Badge>
            </div>
            <h3 className="mt-3 font-serif text-xl text-navy">{prompt.title}</h3>
            <p className="mt-2 text-lg text-muted">{prompt.description}</p>
            <pre className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-cream-dark p-5 text-base leading-relaxed text-navy">
              {prompt.prompt}
            </pre>
            <div className="mt-5">
              <CopyButton text={prompt.prompt} label="Copy this prompt" />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
