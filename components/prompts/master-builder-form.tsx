"use client";

import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  buildMasterPromptFromIdea,
  masterCategories,
  masterDepthLabels,
  masterFormats,
  masterTones,
  type MasterDepth,
} from "@/lib/prompt-master-template";

type Source = "template" | "openai" | null;

export function MasterBuilderForm() {
  const [idea, setIdea] = useState("");
  const [category, setCategory] = useState<string>(masterCategories[0].value);
  const [tone, setTone] = useState<string>(masterTones[0]);
  const [outputFormat, setOutputFormat] = useState<string>(masterFormats[0]);
  const [depth, setDepth] = useState<MasterDepth>("balanced");
  const [prompt, setPrompt] = useState("");
  const [source, setSource] = useState<Source>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    const payload = { idea, category, tone, outputFormat, depth };

    try {
      const res = await fetch("/api/prompts/master", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as {
        prompt?: string;
        source?: Source;
        error?: string;
        message?: string;
      };

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setPrompt(buildMasterPromptFromIdea(payload));
          setSource("template");
          setNotice(
            data.error ??
              "Using offline template (sign in with an active membership for AI enhancement).",
          );
        } else {
          setError(data.error ?? "Could not generate prompt. Please try again.");
        }
        return;
      }

      setPrompt(data.prompt ?? buildMasterPromptFromIdea(payload));
      setSource(data.source ?? "template");
      if (data.message) setNotice(data.message);
    } catch {
      setPrompt(buildMasterPromptFromIdea(payload));
      setSource("template");
      setNotice("Connection issue — showing a strong template prompt instead.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-navy/15 bg-cream px-4 py-3 text-lg text-navy focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30";

  return (
    <div className="space-y-6">
      <Card padding="lg" className="border-gold/30 bg-gold/5">
        <p className="text-lg leading-relaxed text-navy">
          <strong>Privacy note:</strong> Avoid entering passwords, account numbers, full
          medical records, or other highly sensitive details unless you understand what you
          are sharing with ChatGPT. You can describe situations without names or addresses.
        </p>
      </Card>

      <div className="grid gap-10 xl:grid-cols-2">
        <Card padding="lg">
          <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label htmlFor="idea" className="mb-2 block text-lg font-medium text-navy">
                What do you want help with?
              </label>
              <p className="mb-2 text-base text-muted">
                Write it like you would explain to a wise friend — rough is fine.
              </p>
              <textarea
                id="idea"
                required
                minLength={10}
                rows={6}
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Example: I need to talk to my adult son about boundaries without pushing him away. I want to stay loving but clear…"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="category" className="mb-2 block text-lg font-medium text-navy">
                Life area
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass}
              >
                {masterCategories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="depth" className="mb-2 block text-lg font-medium text-navy">
                Depth
              </label>
              <select
                id="depth"
                value={depth}
                onChange={(e) => setDepth(e.target.value as MasterDepth)}
                className={inputClass}
              >
                {(Object.keys(masterDepthLabels) as MasterDepth[]).map((d) => (
                  <option key={d} value={d}>
                    {masterDepthLabels[d]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="tone" className="mb-2 block text-lg font-medium text-navy">
                Tone
              </label>
              <select
                id="tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className={inputClass}
              >
                {masterTones.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="format" className="mb-2 block text-lg font-medium text-navy">
                Output format
              </label>
              <select
                id="format"
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className={inputClass}
              >
                {masterFormats.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden />
                  Building your prompt…
                </>
              ) : (
                "Turn into a master prompt"
              )}
            </Button>
          </form>
        </Card>

        <Card padding="lg" className="flex flex-col">
          <h3 className="font-serif text-2xl text-navy">Your master prompt</h3>

          {error && (
            <div
              className="mt-4 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-base text-red-900"
              role="alert"
            >
              <AlertCircle className="h-5 w-5 shrink-0" aria-hidden />
              {error}
            </div>
          )}

          {notice && !error && (
            <p className="mt-4 rounded-lg bg-cream-dark p-4 text-base text-muted">{notice}</p>
          )}

          {prompt ? (
            <>
              {source && (
                <p className="mt-3 text-sm text-muted">
                  {source === "openai"
                    ? "Enhanced with AI — review and edit before pasting."
                    : "Created with our template formula — still very effective."}
                </p>
              )}
              <pre className="mt-4 max-h-[min(70vh,28rem)] flex-1 overflow-auto whitespace-pre-wrap rounded-lg bg-cream-dark p-5 text-base leading-relaxed text-navy">
                {prompt}
              </pre>
              <div className="mt-6">
                <CopyButton text={prompt} label="Copy master prompt" />
              </div>
            </>
          ) : (
            <p className="mt-6 text-lg text-muted">
              Describe your situation on the left, then click the button. Your polished
              prompt will appear here.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
