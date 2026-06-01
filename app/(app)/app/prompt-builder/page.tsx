import { MasterBuilderForm } from "@/components/prompts/master-builder-form";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Master Prompt Builder",
};

export default function PromptBuilderPage() {
  return (
    <div>
      <SectionHeading
        title="Master Prompt Builder"
        description="Turn a rough idea into a powerful prompt you can paste into ChatGPT — using our calm, seven-part formula."
      />
      <p className="mt-4 max-w-2xl text-muted">
        Describe what you want to create, solve, write, plan, understand, or analyze. We&apos;ll
        shape it into a clear master prompt. AI enhancement will run securely on the server in a
        later update; today uses our trusted template.
      </p>
      <div className="mt-10">
        <MasterBuilderForm />
      </div>
    </div>
  );
}
