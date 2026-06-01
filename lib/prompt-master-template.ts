export type MasterDepth = "quick" | "balanced" | "thorough";

export const masterCategories = [
  { value: "relationships", label: "Relationships & communication" },
  { value: "apologies-hard-conversations", label: "Apologies & hard conversations" },
  { value: "life-planning", label: "Life planning" },
  { value: "deep-analysis", label: "Deep analysis" },
  { value: "family-home", label: "Family & home" },
  { value: "business-work", label: "Business & work" },
  { value: "journaling-reflection", label: "Journaling & reflection" },
  { value: "decision-making", label: "Decision-making" },
  { value: "general", label: "General / everyday life" },
] as const;

export const masterTones = [
  "Warm, wise, and respectful",
  "Direct and clear",
  "Gentle and encouraging",
  "Professional but human",
  "Hopeful and calm",
] as const;

export const masterFormats = [
  "Clear sections with bullet points",
  "Short letter or message draft",
  "Step-by-step plan",
  "Numbered reflection questions first, then advice",
  "Table comparing options",
] as const;

export const masterDepthLabels: Record<MasterDepth, string> = {
  quick: "Quick — short prompt, fast results",
  balanced: "Balanced — good detail for most situations",
  thorough: "Thorough — rich context and careful follow-ups",
};

function depthInstructions(depth: MasterDepth): string {
  switch (depth) {
    case "quick":
      return "Keep the prompt concise while still including all seven formula parts briefly.";
    case "thorough":
      return "Include rich guidance in each formula section and encourage multiple clarifying questions before the main answer.";
    default:
      return "Balance clarity and brevity — complete but not overwhelming.";
  }
}

/** Non-AI fallback for Master Prompt Builder. */
export function buildMasterPromptFromIdea(input: {
  idea: string;
  category?: string;
  tone?: string;
  outputFormat?: string;
  depth?: MasterDepth;
}): string {
  const idea = input.idea.trim() || "help me think through something important in my life";
  const category = input.category?.trim() || "everyday life";
  const tone = input.tone?.trim() || "warm, respectful, and plain-spoken — never condescending";
  const format = input.outputFormat?.trim() || "clear sections with bullet points";
  const depth = input.depth ?? "balanced";

  return `Role: You are a calm, practical coach who helps adults use ChatGPT wisely for real life — not for tech jargon. You specialize in ${category}.

Context: Here is my situation in my own words:
${idea}

Goal: Help me get a useful, thoughtful result I can actually use today. If I need a draft (message, plan, outline), provide it. If I need clarity, ask good questions first.

Constraints:
- Do not invent facts about my life.
- Avoid hype, fear, or “productivity bro” language.
- If something would normally require a licensed professional (medical, legal, mental health), remind me gently and stay educational.
- ${depthInstructions(depth)}

Tone: ${tone}

Output format: ${format}

Follow-up: Before your main answer, ask me up to ${depth === "thorough" ? "5" : depth === "quick" ? "2" : "3"} clarifying questions — one at a time — unless my request is already very specific.`;
}

export const MASTER_BUILDER_SYSTEM_PROMPT = `You help adults (45–75+) write excellent ChatGPT prompts for real life — relationships, planning, work, family, reflection, and decisions.

Given the user's rough idea and preferences, output ONLY the final prompt text they should paste into ChatGPT. No preamble, no markdown fences.

Use this structure with clear labels:
Role:
Context:
Goal:
Constraints:
Tone:
Output format:
Follow-up:

Rules:
- Plain, warm language — never condescending or tech-bro
- Never invent personal facts about the user
- Encourage clarifying questions before major advice
- Keep the prompt copy-paste ready`;
