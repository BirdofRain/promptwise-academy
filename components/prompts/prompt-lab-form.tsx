"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/ui/copy-button";
import { Card } from "@/components/ui/card";
import { labTemplates, type LabCategory } from "@/lib/prompt-lab";

const categories: { id: LabCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "relationships", label: "Relationships" },
  { id: "planning", label: "Planning" },
  { id: "analysis", label: "Analysis" },
  { id: "family", label: "Family" },
  { id: "work", label: "Work" },
  { id: "general", label: "General" },
];

export function PromptLabForm() {
  const [category, setCategory] = useState<LabCategory | "all">("all");
  const [templateIndex, setTemplateIndex] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});

  const filtered = useMemo(
    () =>
      category === "all"
        ? labTemplates
        : labTemplates.filter((t) => t.category === category),
    [category],
  );

  const template = filtered[templateIndex] ?? filtered[0];

  const prompt = template ? template.build(values) : "";

  function handleCategoryChange(next: LabCategory | "all") {
    setCategory(next);
    setTemplateIndex(0);
    setValues({});
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <div>
          <p className="mb-2 text-sm font-medium text-navy">Category</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`rounded-full px-3 py-1 text-sm transition-colors ${
                  category === cat.id
                    ? "bg-navy text-cream"
                    : "bg-cream-dark text-navy hover:bg-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="template" className="mb-1 block text-sm font-medium text-navy">
            Template
          </label>
          <select
            id="template"
            value={templateIndex}
            onChange={(e) => {
              setTemplateIndex(Number(e.target.value));
              setValues({});
            }}
            className="w-full rounded-lg border border-navy/15 bg-white px-3 py-2 text-navy"
          >
            {filtered.map((t, i) => (
              <option key={t.label} value={i}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {template?.fields.map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="mb-1 block text-sm font-medium text-navy">
              {field.label}
            </label>
            {field.multiline ? (
              <textarea
                id={field.id}
                rows={3}
                placeholder={field.placeholder}
                value={values[field.id] ?? ""}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [field.id]: e.target.value }))
                }
                className="w-full rounded-lg border border-navy/15 bg-white px-4 py-2.5 text-navy focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30"
              />
            ) : (
              <input
                id={field.id}
                type="text"
                placeholder={field.placeholder}
                value={values[field.id] ?? ""}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [field.id]: e.target.value }))
                }
                className="w-full rounded-lg border border-navy/15 bg-white px-4 py-2.5 text-navy focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30"
              />
            )}
          </div>
        ))}
      </div>

      <Card className="flex flex-col">
        <h3 className="font-serif text-lg text-navy">Your prompt</h3>
        <p className="mt-1 text-sm text-muted">
          Copy and paste into ChatGPT. Refine by saying &ldquo;warmer&rdquo; or &ldquo;shorter.&rdquo;
        </p>
        <pre className="mt-4 flex-1 overflow-auto whitespace-pre-wrap rounded-lg bg-cream-dark p-4 text-sm leading-relaxed text-navy">
          {prompt}
        </pre>
        <div className="mt-4">
          <CopyButton text={prompt} />
        </div>
      </Card>
    </div>
  );
}
