import { Suspense } from "react";
import { PromptLibraryBrowser } from "@/components/prompts/prompt-library-browser";
import { PromptLibraryTools } from "@/components/prompts/prompt-library-tools";
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
            ? "Copy a ready-made prompt, or build your own in Prompt Lab and Master Prompt Builder."
            : "Sample prompts are free. Start your trial or subscribe for the full library and building tools."
        }
      />

      <div className="mt-6">
        <PromptLibraryTools />
      </div>

      <Suspense fallback={<PromptLibraryFallback />}>
        <div className="mt-8">
          <PromptLibraryBrowser isPaid={paid} />
        </div>
      </Suspense>
    </div>
  );
}
