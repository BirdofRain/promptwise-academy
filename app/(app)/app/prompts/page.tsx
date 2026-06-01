import { PromptCardItem } from "@/components/prompts/prompt-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { promptLibrary, promptCategories } from "@/content/prompt-library";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prompt library",
};

export default function PromptsPage() {
  return (
    <div>
      <SectionHeading
        title="Prompt library"
        description="Copy-ready examples for real life. Paste into ChatGPT, answer any follow-up questions, then edit in your voice."
      />

      {promptCategories.map((cat) => {
        const cards = promptLibrary.filter((p) => p.category === cat.id);
        if (cards.length === 0) return null;
        return (
          <section key={cat.id} className="mt-12">
            <h2 className="font-serif text-2xl text-navy">{cat.label}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {cards.map((card) => (
                <PromptCardItem key={card.id} card={card} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
