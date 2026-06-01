import { PromptLibraryBrowser } from "@/components/prompts/prompt-library-browser";
import { SectionHeading } from "@/components/ui/section-heading";
import { promptCategories } from "@/content/prompt-library";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prompt library",
};

export default function PromptsPage() {
  return (
    <div className="app-readable">
      <SectionHeading
        title="Prompt library"
        description="Copy-ready examples for real life. Pick a category, choose your comfort level, and paste into ChatGPT."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {promptCategories
          .filter((c) => !c.comingSoon)
          .map((cat) => (
            <div
              key={cat.id}
              className="rounded-xl border border-navy/10 bg-white p-5"
            >
              <p className="text-lg font-medium text-navy">{cat.label}</p>
              <p className="mt-1 text-base text-muted">{cat.description}</p>
            </div>
          ))}
      </div>

      <div className="mt-12">
        <PromptLibraryBrowser />
      </div>
    </div>
  );
}
