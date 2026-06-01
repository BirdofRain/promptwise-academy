export type LabCategory =
  | "relationships"
  | "planning"
  | "analysis"
  | "family"
  | "work"
  | "general";

export interface LabField {
  id: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
}

export interface LabTemplate {
  category: LabCategory;
  label: string;
  fields: LabField[];
  build: (values: Record<string, string>) => string;
}

export const labTemplates: LabTemplate[] = [
  {
    category: "relationships",
    label: "Thoughtful message",
    fields: [
      { id: "person", label: "Who is this for?", placeholder: "My daughter, a close friend..." },
      { id: "situation", label: "What is going on?", placeholder: "They are going through...", multiline: true },
      { id: "goal", label: "What do you want the message to do?", placeholder: "Encourage, apologize, check in..." },
    ],
    build: (v) => `Role: Thoughtful friend helping me write a message.

Context: This is for ${v.person || "[person]"}. Situation: ${v.situation || "[situation]"}

Goal: ${v.goal || "Write a warm, sincere message"}

Tone: Sincere, not dramatic. No clichés.
Output: 2 short versions (warm and brief). Under 100 words each.
Ask me 2 clarifying questions before you draft.`,
  },
  {
    category: "planning",
    label: "Weekly rhythm",
    fields: [
      { id: "priorities", label: "Top priorities this week", placeholder: "Family dinner, exercise, client work...", multiline: true },
      { id: "time", label: "Flexible hours available", placeholder: "About 10 hours outside of work" },
    ],
    build: (v) => `Role: Gentle life planner.

Context: My priorities: ${v.priorities || "[priorities]"}. Flexible time: ${v.time || "[hours]"}.

Goal: Suggest a sustainable weekly rhythm with margin — not a rigid schedule.

Tone: Encouraging, realistic.
Output: Simple table by day with morning/afternoon/evening themes.`,
  },
  {
    category: "analysis",
    label: "Decision clarity",
    fields: [
      { id: "decision", label: "What are you deciding?", placeholder: "Move, job change, major purchase..." },
      { id: "options", label: "Options you are considering", placeholder: "Option A vs Option B", multiline: true },
      { id: "values", label: "What matters most to you?", placeholder: "Family stability, health, faith, finances..." },
    ],
    build: (v) => `Role: Decision-making coach.

Context: I am deciding: ${v.decision || "[decision]"}. Options: ${v.options || "[options]"}. Values: ${v.values || "[values]"}.

Goal: Pros/cons table, blind spots, and 3 questions to discuss with a trusted person. Do not decide for me.

Tone: Respectful, clear.
Output: Table + short summary.`,
  },
  {
    category: "family",
    label: "Family meeting",
    fields: [
      { id: "topic", label: "Topic", placeholder: "Holiday plans, caregiving, schedules..." },
      { id: "attendees", label: "Who is involved?", placeholder: "Siblings, adult children..." },
    ],
    build: (v) => `Role: Calm family meeting facilitator.

Context: Topic: ${v.topic || "[topic]"}. People: ${v.attendees || "[attendees]"}.

Goal: Agenda, ground rules, opening script, and action items.

Tone: Inclusive, kind.`,
  },
  {
    category: "work",
    label: "Professional email",
    fields: [
      { id: "recipient", label: "Recipient", placeholder: "Client, colleague, vendor..." },
      { id: "purpose", label: "Purpose", placeholder: "Follow up, request info, say no kindly...", multiline: true },
    ],
    build: (v) => `Role: Professional writing assistant.

Context: Email to ${v.recipient || "[recipient]"}. Purpose: ${v.purpose || "[purpose]"}.

Goal: Draft under 150 words with clear subject line and one call to action.

Tone: Warm and professional.`,
  },
  {
    category: "general",
    label: "Custom (full formula)",
    fields: [
      { id: "role", label: "Role", placeholder: "Calm coach, wise editor..." },
      { id: "context", label: "Context", placeholder: "What is going on?", multiline: true },
      { id: "goal", label: "Goal", placeholder: "What do you want?" },
      { id: "tone", label: "Tone", placeholder: "Warm, direct, hopeful..." },
      { id: "format", label: "Output format", placeholder: "Bullets, short letter, steps..." },
    ],
    build: (v) => `Role: ${v.role || "A helpful, patient assistant"}

Context: ${v.context || "[your context]"}

Goal: ${v.goal || "[your goal]"}

Constraints: Keep it practical; no jargon.

Tone: ${v.tone || "Warm and clear"}

Output format: ${v.format || "Bullet points"}

Follow-up: Ask me 3 clarifying questions before your main answer.`,
  },
];
