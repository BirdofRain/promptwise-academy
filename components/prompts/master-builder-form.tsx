"use client";

import { useState } from "react";
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { buildMasterPromptFromIdea } from "@/lib/prompt-master-template";

export function MasterBuilderForm() {
  const [idea, setIdea] = useState("");
  const [category, setCategory] = useState("relationships and communication");
  const [tone, setTone] = useState("warm, wise, and respectful");
  const [outputFormat, setOutputFormat] = useState("clear sections with bullet points");
  const [prompt, setPrompt] = useState("");

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setPrompt(
      buildMasterPromptFromIdea({
        idea,
        category,
        tone,
        outputFormat,
      }),
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label htmlFor="idea" className="mb-1 block text-sm font-medium text-navy">
              What do you want help with?
            </label>
            <textarea
              id="idea"
              required
              rows={5}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Example: I need to talk to my adult son about boundaries without pushing him away..."
              className="w-full rounded-lg border border-navy/15 bg-cream px-4 py-2.5 text-navy focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30"
            />
          </div>
          <div>
            <label htmlFor="category" className="mb-1 block text-sm font-medium text-navy">
              Life area
            </label>
            <input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-navy/15 bg-cream px-4 py-2.5 text-navy"
            />
          </div>
          <div>
            <label htmlFor="tone" className="mb-1 block text-sm font-medium text-navy">
              Tone
            </label>
            <input
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full rounded-lg border border-navy/15 bg-cream px-4 py-2.5 text-navy"
            />
          </div>
          <div>
            <label htmlFor="format" className="mb-1 block text-sm font-medium text-navy">
              Output format
            </label>
            <input
              id="format"
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              className="w-full rounded-lg border border-navy/15 bg-cream px-4 py-2.5 text-navy"
            />
          </div>
          <Button type="submit" className="w-full">
            Turn into a master prompt
          </Button>
          <p className="text-xs text-muted">
            Template mode for now. OpenAI enhancement will run server-side in a later phase.
          </p>
        </form>
      </Card>

      <Card className="flex flex-col">
        <h3 className="font-serif text-lg text-navy">Your master prompt</h3>
        {prompt ? (
          <>
            <pre className="mt-4 flex-1 overflow-auto whitespace-pre-wrap rounded-lg bg-cream-dark p-4 text-sm text-navy">
              {prompt}
            </pre>
            <div className="mt-4">
              <CopyButton text={prompt} label="Copy master prompt" />
            </div>
          </>
        ) : (
          <p className="mt-4 text-muted">
            Describe your situation on the left, then click generate. You&apos;ll get a
            polished prompt using our seven-part formula.
          </p>
        )}
      </Card>
    </div>
  );
}
