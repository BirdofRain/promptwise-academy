import { PromptLabForm } from "@/components/prompts/prompt-lab-form";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prompt Lab",
};

const formulaSteps = [
  "Role",
  "Context",
  "Goal",
  "Constraints",
  "Tone",
  "Output format",
  "Follow-up questions",
];

export default function PromptLabPage() {
  return (
    <div>
      <SectionHeading
        title="Prompt Lab"
        description="Choose a category, fill in plain-English fields, and get a prompt you can copy into ChatGPT."
      />

      <Card className="mt-8 border-sage/20 bg-sage/5 p-6">
        <h2 className="font-serif text-lg text-navy">The Prompt Formula</h2>
        <ol className="mt-3 flex flex-wrap gap-2">
          {formulaSteps.map((step, i) => (
            <li
              key={step}
              className="rounded-full bg-white px-3 py-1 text-sm text-navy shadow-sm"
            >
              {i + 1}. {step}
            </li>
          ))}
        </ol>
      </Card>

      <div className="mt-10">
        <PromptLabForm />
      </div>
    </div>
  );
}
