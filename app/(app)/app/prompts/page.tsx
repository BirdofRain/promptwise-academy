import { Suspense } from "react";
import { PromptLibraryBrowser } from "@/components/prompts/prompt-library-browser";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCurrentUserAccess } from "@/lib/user-access";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prompt library",
};

function PromptLibraryFallback() {
  return (
    <div className="mt-8 rounded-xl border border-navy/10 bg-white p-8 text-center text-lg text-muted">
      Loading prompts…
    </div>
  );
}

export default async function PromptsPage() {
  const access = await getCurrentUserAccess();
  const paid = access.hasFullAccess;

  return (
    <div className="app-readable">
      <SectionHeading
        title="Prompt library"
        description={
          paid
            ? "Search or pick a topic, then copy a prompt into ChatGPT. Answer follow-up questions, then edit in your voice."
            : "Sample prompts are free. Start your trial or subscribe for the full library, Prompt Lab, and Master Prompt Builder."
        }
      />

      <Suspense fallback={<PromptLibraryFallback />}>
        <div className="mt-6">
          <PromptLibraryBrowser isPaid={paid} />
        </div>
      </Suspense>
    </div>
  );
}
