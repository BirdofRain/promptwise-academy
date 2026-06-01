import { MasterBuilderForm } from "@/components/prompts/master-builder-form";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Master Prompt Builder",
};

export default function PromptBuilderPage() {
  return (
    <div className="app-readable">
      <SectionHeading
        title="Master Prompt Builder"
        description="Turn a rough idea into a powerful prompt you can paste into ChatGPT. Describe your situation — we apply the calm, seven-part formula for you."
      />

      <div className="mt-10">
        <MasterBuilderForm />
      </div>
    </div>
  );
}
