import { PromptLabForm } from "@/components/prompts/prompt-lab-form";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prompt Lab",
};

export default function PromptLabPage() {
  return (
    <div className="app-readable">
      <SectionHeading
        title="Prompt Lab"
        description="Build a strong prompt step by step. Each box explains what to write in plain English — no jargon required."
      />

      <div className="mt-10">
        <PromptLabForm />
      </div>
    </div>
  );
}
