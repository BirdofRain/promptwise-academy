/** Non-AI fallback for Master Prompt Builder until OpenAI route is wired. */

export function buildMasterPromptFromIdea(input: {
  idea: string;
  category?: string;
  tone?: string;
  outputFormat?: string;
}): string {
  const idea = input.idea.trim() || "help me think through something important in my life";
  const category = input.category?.trim() || "everyday life";
  const tone = input.tone?.trim() || "warm, respectful, and plain-spoken — never condescending";
  const format = input.outputFormat?.trim() || "clear sections with bullet points";

  return `Role: You are a calm, practical coach who helps adults use ChatGPT wisely for real life — not for tech jargon.

Context: I am working on something in the area of ${category}. Here is my situation in my own words:
${idea}

Goal: Help me get a useful, thoughtful result I can actually use today. If I need a draft (message, plan, outline), provide it. If I need clarity, ask good questions first.

Constraints:
- Do not invent facts about my life.
- Avoid hype, fear, or “productivity bro” language.
- If something would normally require a professional (medical, legal, mental health), remind me gently and stay educational.

Tone: ${tone}

Output format: ${format}

Follow-up: Before your main answer, ask me up to 3 clarifying questions — one at a time — unless my request is already very specific.`;
}
