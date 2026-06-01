import { PaidFeatureGate } from "@/components/app/paid-feature-gate";
import { MasterBuilderForm } from "@/components/prompts/master-builder-form";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Master Prompt Builder",
};

export default function PromptBuilderPage() {
  return (
    <PaidFeatureGate featureName="Master Prompt Builder">
      <div className="app-readable">
        <SectionHeading
          title="Master Prompt Builder"
          description="Turn a rough idea into a powerful prompt you can paste into ChatGPT."
        />
        <div className="mt-10">
          <MasterBuilderForm />
        </div>
      </div>
    </PaidFeatureGate>
  );
}
