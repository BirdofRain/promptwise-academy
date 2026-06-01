export interface FormulaField {
  id: keyof FormulaValues;
  label: string;
  explanation: string;
  placeholder: string;
  example: string;
  multiline?: boolean;
}

export interface FormulaValues {
  role: string;
  context: string;
  goal: string;
  constraints: string;
  tone: string;
  outputFormat: string;
  followUp: string;
}

export const formulaFields: FormulaField[] = [
  {
    id: "role",
    label: "Role",
    explanation:
      "Tell ChatGPT who to be — a calm coach, thoughtful editor, listening friend, or practical planner.",
    placeholder: "e.g., A patient life coach for adults learning ChatGPT",
    example: "A warm communication coach who helps with family conversations",
  },
  {
    id: "context",
    label: "Context",
    explanation:
      "What is going on? Include relevant facts, relationships, and timing. More context usually means better answers.",
    placeholder: "Describe your situation in a few sentences…",
    example:
      "My adult daughter and I have been distant since the holidays. I want to reach out without pressure.",
    multiline: true,
  },
  {
    id: "goal",
    label: "Goal",
    explanation:
      "What do you want as a result? A draft message, a plan, questions to reflect on, or a clear decision framework.",
    placeholder: "e.g., Help me write a short, kind text to reopen conversation",
    example: "Give me 2 text options under 80 words and 3 questions I could ask her",
  },
  {
    id: "constraints",
    label: "Constraints",
    explanation:
      "Limits help — word count, topics to avoid, or things ChatGPT should not assume about your life.",
    placeholder: "e.g., Under 150 words, no blaming language, do not invent details",
    example: "No medical advice; keep it under 200 words; I will edit before sending",
    multiline: true,
  },
  {
    id: "tone",
    label: "Tone",
    explanation: "How should the response feel? Warm, direct, hopeful, professional, pastoral, etc.",
    placeholder: "e.g., Warm, respectful, plain language — never condescending",
    example: "Gentle and hopeful, like a wise friend",
  },
  {
    id: "outputFormat",
    label: "Output format",
    explanation:
      "How should ChatGPT structure the answer? Bullets, numbered steps, a letter draft, or a table.",
    placeholder: "e.g., Bullet points, short letter, step-by-step",
    example: "Numbered steps, then one sample draft at the end",
  },
  {
    id: "followUp",
    label: "Follow-up questions",
    explanation:
      "Ask ChatGPT to interview you first. This single habit dramatically improves complex prompts.",
    placeholder: "e.g., Ask me 3 clarifying questions before your main answer",
    example: "Ask up to 3 clarifying questions one at a time before you advise me",
  },
];

export function buildPromptFromFormula(values: Partial<FormulaValues>): string {
  const v = {
    role: values.role?.trim() || "A calm, practical assistant who helps adults with real-life tasks",
    context: values.context?.trim() || "[Describe your situation here]",
    goal: values.goal?.trim() || "[What you want help with]",
    constraints:
      values.constraints?.trim() ||
      "Do not invent facts about my life. Avoid jargon and hype.",
    tone: values.tone?.trim() || "Warm, respectful, and plain-spoken",
    outputFormat: values.outputFormat?.trim() || "Clear sections with bullet points",
    followUp:
      values.followUp?.trim() ||
      "Ask me up to 3 clarifying questions before your main answer.",
  };

  return `Role: ${v.role}

Context: ${v.context}

Goal: ${v.goal}

Constraints: ${v.constraints}

Tone: ${v.tone}

Output format: ${v.outputFormat}

Follow-up: ${v.followUp}`;
}

export const formulaExamples = [
  {
    title: "Hard conversation with family",
    values: {
      role: "Communication coach for respectful family talks",
      context: "I need to talk with my brother about our mother's care. We disagree on next steps.",
      goal: "Prepare an opening line, 3 talking points, and a calm closing",
      constraints: "No blaming; under 250 words for the outline",
      tone: "Firm and kind",
      outputFormat: "Bullet outline I can practice",
      followUp: "Ask me 3 clarifying questions first",
    },
  },
  {
    title: "Weekly planning",
    values: {
      role: "Gentle planner who values rest",
      context: "I work part-time and help with grandchildren on Tuesdays and Thursdays.",
      goal: "A simple weekly rhythm with margin, not a rigid schedule",
      constraints: "Max 30 minutes of planning tasks per day",
      tone: "Encouraging, realistic",
      outputFormat: "Table by day (morning / afternoon / evening)",
      followUp: "Ask me 2 questions about my energy levels first",
    },
  },
];
