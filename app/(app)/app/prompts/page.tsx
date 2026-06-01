import { PromptLibraryBrowser } from "@/components/prompts/prompt-library-browser";
import { SectionHeading } from "@/components/ui/section-heading";
import { promptCategories } from "@/content/prompt-library";
import { getCurrentUser, hasPaidAccess } from "@/lib/auth/session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prompt library",
};

export default async function PromptsPage() {
  const user = await getCurrentUser();
  const paid = hasPaidAccess(user ?? null);

  return (
    <div className="app-readable">
      <SectionHeading
        title="Prompt library"
        description={
          paid
            ? "Copy-ready examples for real life. Paste into ChatGPT, answer follow-up questions, then edit in your voice."
            : "Sample prompts are free. Subscribe for the complete library, Prompt Lab, and Master Prompt Builder."
        }
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {promptCategories
          .filter((c) => !c.comingSoon)
          .map((cat) => (
            <div key={cat.id} className="rounded-xl border border-navy/10 bg-white p-5">
              <p className="text-lg font-medium text-navy">{cat.label}</p>
              <p className="mt-1 text-base text-muted">{cat.description}</p>
            </div>
          ))}
      </div>

      <div className="mt-12">
        <PromptLibraryBrowser isPaid={paid} />
      </div>
    </div>
  );
}
