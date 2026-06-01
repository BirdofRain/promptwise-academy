import { ExternalLink } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";

interface ChatGPTCalloutProps {
  promptText?: string;
}

export function ChatGPTCallout({ promptText }: ChatGPTCalloutProps) {
  return (
    <aside className="rounded-xl border-2 border-sage/30 bg-sage/10 p-6 md:p-8">
      <h2 className="font-serif text-2xl text-navy">Try this in ChatGPT</h2>
      <ol className="mt-4 list-decimal space-y-3 pl-6 text-lg text-navy">
        <li>Copy the prompt below (or from the examples).</li>
        <li>
          Open{" "}
          <a
            href="https://chat.openai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-sage-dark underline"
          >
            ChatGPT
            <ExternalLink className="h-4 w-4" aria-hidden />
          </a>{" "}
          in your browser or app.
        </li>
        <li>Paste the prompt and press Enter.</li>
        <li>Answer any follow-up questions ChatGPT asks — then edit the result in your own words.</li>
      </ol>
      {promptText && (
        <div className="mt-6">
          <CopyButton text={promptText} label="Copy prompt for ChatGPT" className="text-base" />
        </div>
      )}
    </aside>
  );
}
