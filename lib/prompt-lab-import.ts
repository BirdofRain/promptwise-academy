import type { FormulaValues } from "@/lib/prompt-lab";
import type { PromptCard } from "@/content/prompt-library";

type FormulaKey = keyof FormulaValues;

const SECTION_MAP: { key: FormulaKey; prefixes: string[] }[] = [
  { key: "role", prefixes: ["role"] },
  { key: "context", prefixes: ["context"] },
  { key: "goal", prefixes: ["goal"] },
  { key: "constraints", prefixes: ["constraints", "rules", "limits"] },
  { key: "tone", prefixes: ["tone"] },
  { key: "outputFormat", prefixes: ["output format", "output", "format"] },
  { key: "followUp", prefixes: ["follow-up", "follow up", "followup"] },
];

function normalizeLabel(label: string): string {
  return label.toLowerCase().replace(/\s+/g, " ").trim();
}

function matchSectionKey(label: string): FormulaKey | null {
  const normalized = normalizeLabel(label);
  for (const { key, prefixes } of SECTION_MAP) {
    if (prefixes.some((p) => normalized === p || normalized.startsWith(`${p}:`))) {
      return key;
    }
  }
  return null;
}

function extractFollowUpFromLine(line: string): string | null {
  const trimmed = line.trim();
  if (/^ask me .*(question|clarif)/i.test(trimmed)) return trimmed;
  if (/^before you answer,/i.test(trimmed)) return trimmed;
  return null;
}

function extractRoleFromActAs(line: string): string | null {
  const match = line.match(/^act as (.+)$/i);
  return match ? match[1].trim() : null;
}

/**
 * Parse a library prompt string into Prompt Lab formula fields.
 * Handles Role/Context/Goal labels, "Act as…", Output, and trailing follow-up lines.
 */
export function parseLibraryPromptToFormula(prompt: string): Partial<FormulaValues> {
  const values: Partial<FormulaValues> = {};
  const lines = prompt.split("\n");
  let currentKey: FormulaKey | null = null;
  const buffers: Partial<Record<FormulaKey, string[]>> = {};

  const append = (key: FormulaKey, text: string) => {
    if (!text) return;
    buffers[key] = buffers[key] ?? [];
    buffers[key]!.push(text);
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const headerMatch = trimmed.match(/^([A-Za-z][A-Za-z\s-]+):\s*(.*)$/);
    if (headerMatch) {
      const key = matchSectionKey(headerMatch[1]);
      if (key) {
        currentKey = key;
        append(key, headerMatch[2].trim());
        continue;
      }
    }

    const actAsRole = extractRoleFromActAs(trimmed);
    if (actAsRole) {
      currentKey = "role";
      append("role", actAsRole);
      continue;
    }

    const followUp = extractFollowUpFromLine(trimmed);
    if (followUp) {
      currentKey = "followUp";
      append("followUp", followUp);
      continue;
    }

    if (currentKey) {
      append(currentKey, trimmed);
    }
  }

  for (const [key, parts] of Object.entries(buffers) as [FormulaKey, string[]][]) {
    values[key] = parts.join("\n").trim();
  }

  if (Object.keys(values).length === 0) {
    values.context = prompt.trim();
    values.goal = "Help me adapt this template with my personal details.";
  }

  return values;
}

export function getLabSeedFromPromptCard(card: PromptCard): FormulaValues {
  const parsed = parseLibraryPromptToFormula(card.prompt);
  return {
    role: parsed.role ?? "",
    context: parsed.context ?? "",
    goal: parsed.goal ?? card.description,
    constraints: parsed.constraints ?? "",
    tone: parsed.tone ?? "",
    outputFormat: parsed.outputFormat ?? "",
    followUp: parsed.followUp ?? "",
  };
}

export function promptLabUrlForCard(promptId: string): string {
  return `/app/prompt-lab?from=${encodeURIComponent(promptId)}`;
}
