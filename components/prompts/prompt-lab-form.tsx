"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CopyButton } from "@/components/ui/copy-button";
import { Card } from "@/components/ui/card";
import { getPromptById } from "@/content/prompt-library";
import { getLabSeedFromPromptCard } from "@/lib/prompt-lab-import";
import {
  buildPromptFromFormula,
  formulaExamples,
  formulaFields,
  type FormulaValues,
} from "@/lib/prompt-lab";
import { Lightbulb, Library } from "lucide-react";

const emptyValues: FormulaValues = {
  role: "",
  context: "",
  goal: "",
  constraints: "",
  tone: "",
  outputFormat: "",
  followUp: "",
};

interface PromptLabFormProps {
  initialPromptId?: string | null;
}

function initialStateForPromptId(promptId?: string | null): {
  values: FormulaValues;
  loadedFrom: { title: string; id: string } | null;
} {
  if (!promptId) {
    return { values: emptyValues, loadedFrom: null };
  }
  const card = getPromptById(promptId);
  if (!card) {
    return { values: emptyValues, loadedFrom: null };
  }
  return {
    values: getLabSeedFromPromptCard(card),
    loadedFrom: { title: card.title, id: card.id },
  };
}

export function PromptLabForm({ initialPromptId }: PromptLabFormProps) {
  const [values, setValues] = useState<FormulaValues>(
    () => initialStateForPromptId(initialPromptId).values,
  );
  const [loadedFrom, setLoadedFrom] = useState<{ title: string; id: string } | null>(
    () => initialStateForPromptId(initialPromptId).loadedFrom,
  );

  const prompt = useMemo(() => buildPromptFromFormula(values), [values]);

  function loadExample(example: (typeof formulaExamples)[0]) {
    setValues(example.values as FormulaValues);
    setLoadedFrom(null);
  }

  function clearForm() {
    setValues(emptyValues);
    setLoadedFrom(null);
  }

  return (
    <div className="grid gap-10 xl:grid-cols-2">
      <div className="space-y-6">
        {loadedFrom && (
          <Card padding="lg" className="border-sage/30 bg-sage/5">
            <div className="flex gap-3">
              <Library className="h-6 w-6 shrink-0 text-sage-dark" aria-hidden />
              <div>
                <h3 className="font-serif text-xl text-navy">Loaded from the prompt library</h3>
                <p className="mt-2 text-lg text-muted">
                  <strong>{loadedFrom.title}</strong> — edit each box below with your names,
                  situation, and details. Replace placeholders like{" "}
                  <span className="font-medium text-navy">[NAME]</span> with your own words.
                </p>
                <Link
                  href="/app/prompts"
                  className="mt-2 inline-block text-base font-medium text-sage-dark underline hover:no-underline"
                >
                  Back to prompt library
                </Link>
              </div>
            </div>
          </Card>
        )}

        <Card padding="lg" className="border-sage/20 bg-sage/5">
          <div className="flex gap-3">
            <Lightbulb className="h-6 w-6 shrink-0 text-sage-dark" aria-hidden />
            <div>
              <h3 className="font-serif text-xl text-navy">How this works</h3>
              <p className="mt-2 text-lg text-muted">
                Fill in each box in plain English. You do not need perfect words — ChatGPT
                understands normal speech. When you are done, copy the prompt on the right
                into ChatGPT.
              </p>
            </div>
          </div>
        </Card>

        <div>
          <p className="mb-3 text-base font-medium text-navy">Try an example</p>
          <div className="flex flex-wrap gap-2">
            {formulaExamples.map((ex) => (
              <button
                key={ex.title}
                type="button"
                onClick={() => loadExample(ex)}
                className="rounded-lg border border-navy/15 bg-white px-4 py-2.5 text-base text-navy transition-colors hover:border-sage hover:bg-cream-dark"
              >
                {ex.title}
              </button>
            ))}
            <button
              type="button"
              onClick={clearForm}
              className="rounded-lg px-4 py-2.5 text-base text-muted underline"
            >
              Clear all fields
            </button>
          </div>
        </div>

        {formulaFields.map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="mb-1 block text-lg font-medium text-navy">
              {field.label}
            </label>
            <p className="mb-2 text-base text-muted">{field.explanation}</p>
            {field.multiline ? (
              <textarea
                id={field.id}
                rows={4}
                placeholder={field.placeholder}
                value={values[field.id]}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [field.id]: e.target.value }))
                }
                className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-lg text-navy focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30"
              />
            ) : (
              <input
                id={field.id}
                type="text"
                placeholder={field.placeholder}
                value={values[field.id]}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [field.id]: e.target.value }))
                }
                className="w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-lg text-navy focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30"
              />
            )}
            <p className="mt-1.5 text-sm text-muted">
              Example: <span className="italic">{field.example}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="xl:sticky xl:top-8 xl:self-start">
        <Card padding="lg" className="flex flex-col">
          <h3 className="font-serif text-2xl text-navy">Your completed prompt</h3>
          <p className="mt-2 text-lg text-muted">
            Updates as you type. Copy when ready.
          </p>
          <pre className="mt-5 max-h-[min(70vh,32rem)] flex-1 overflow-auto whitespace-pre-wrap rounded-lg bg-cream-dark p-5 text-base leading-relaxed text-navy">
            {prompt}
          </pre>
          <div className="mt-6">
            <CopyButton text={prompt} label="Copy prompt for ChatGPT" />
          </div>
        </Card>
      </div>
    </div>
  );
}
