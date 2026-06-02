import { PaidFeatureGate } from "@/components/app/paid-feature-gate";
import { PromptLabForm } from "@/components/prompts/prompt-lab-form";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prompt Lab",
};

interface PromptLabPageProps {
  searchParams: Promise<{ from?: string }>;
}

export default async function PromptLabPage({ searchParams }: PromptLabPageProps) {
  const { from } = await searchParams;

  return (
    <PaidFeatureGate featureName="Prompt Lab">
      <div className="app-readable">
        <SectionHeading
          title="Prompt Lab"
          description={
            from
              ? "Customize your library prompt below — add your details, then copy into ChatGPT."
              : "Build a strong prompt step by step. Each box explains what to write in plain English — no jargon required."
          }
        />
        <div className="mt-10">
          <PromptLabForm key={from ?? "blank"} initialPromptId={from} />
        </div>
      </div>
    </PaidFeatureGate>
  );
}
