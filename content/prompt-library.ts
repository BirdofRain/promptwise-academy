export type PromptCategory =
  | "basics"
  | "relationships"
  | "planning"
  | "analysis"
  | "family"
  | "work";

export interface PromptCard {
  id: string;
  title: string;
  category: PromptCategory;
  description: string;
  prompt: string;
  tags?: string[];
}

export const promptCategories: { id: PromptCategory; label: string }[] = [
  { id: "basics", label: "Basics" },
  { id: "relationships", label: "Relationships" },
  { id: "planning", label: "Life planning" },
  { id: "analysis", label: "Deep analysis" },
  { id: "family", label: "Family & home" },
  { id: "work", label: "Work & business" },
];

export const promptLibrary: PromptCard[] = [
  {
    id: "basics-first-win",
    title: "Your first win — explain something simply",
    category: "basics",
    description: "Ask ChatGPT to teach you one thing in plain language.",
    prompt: `Act as a patient teacher for someone who is smart but new to ChatGPT.

Context: I want to understand [TOPIC] without jargon.

Goal: Explain it in simple language, then give me 3 practical ways I could use ChatGPT for this in everyday life.

Tone: Warm, respectful, never condescending.
Output: Short sections with bullet points.
Before you answer, ask me 2 clarifying questions.`,
    tags: ["starter", "basics"],
  },
  {
    id: "basics-clarifying-questions",
    title: "Ask clarifying questions first",
    category: "basics",
    description: "A meta-prompt that improves almost any task.",
    prompt: `I need your help with something important.

Before you give advice or a draft, ask me up to 5 clarifying questions — one at a time — so you understand my situation.

After I answer, provide your best response in plain, warm language.`,
    tags: ["starter", "formula"],
  },
  {
    id: "basics-formula-practice",
    title: "Practice the full Prompt Formula",
    category: "basics",
    description: "Template with all seven parts labeled.",
    prompt: `Role: You are a calm life coach who helps adults use ChatGPT wisely.

Context: [Describe your situation in 3–5 sentences]

Goal: [What you want — draft, plan, list, decision help, etc.]

Constraints: [What to avoid — length, tone, topics, etc.]

Tone: [e.g., warm, direct, hopeful, professional]

Output format: [e.g., bullet points, short letter, step-by-step]

Follow-up: Ask me 3 clarifying questions before your main answer.`,
    tags: ["formula"],
  },
  {
    id: "basics-low-stakes",
    title: "Low-stakes practice task",
    category: "basics",
    description: "Build confidence with something easy.",
    prompt: `Help me with a low-stakes practice task.

I want to plan a nice Saturday morning for myself that includes coffee, a walk, and one small errand. Ask me 2 questions about my mobility and preferences, then suggest a gentle schedule.`,
    tags: ["starter"],
  },
  {
    id: "rel-encouragement-text",
    title: "Encouragement text to a friend",
    category: "relationships",
    description: "A sincere message without sounding cheesy.",
    prompt: `Role: Thoughtful friend helping me write a text message.

Context: My friend [NAME] is going through [SITUATION]. Our relationship is [close / casual / long-distance].

Goal: Write 2 versions of a short encouragement text (under 80 words each): one warm, one brief.

Tone: Sincere, not dramatic. No clichés.
Output: Label each version. Do not send — I will edit.`,
    tags: ["text", "friend"],
  },
  {
    id: "rel-boundary-talk",
    title: "Prepare a boundary conversation",
    category: "relationships",
    description: "Clear, kind language for a difficult talk.",
    prompt: `Role: Communication coach for difficult but respectful conversations.

Context: I need to set a boundary with [PERSON] about [ISSUE]. I want to stay relational, not aggressive.

Goal: Help me prepare — opening line, 3 key points, and a closing that invites dialogue.

Constraints: No blaming language. Under 250 words for the spoken outline.
Tone: Firm and kind.
Ask me 4 clarifying questions first.`,
    tags: ["boundaries", "hard conversation"],
  },
  {
    id: "rel-reflective-listening",
    title: "Reflective listening practice",
    category: "relationships",
    description: "Understand before you respond.",
    prompt: `Role: Listening coach.

Context: Someone said: "[QUOTE OR SUMMARY]". I tend to [fix / defend / withdraw].

Goal: Give me 5 reflective listening phrases I could use, and 3 questions that show curiosity without fixing.

Tone: Gentle and practical.`,
    tags: ["listening"],
  },
  {
    id: "rel-apology-draft",
    title: "Repair apology draft",
    category: "relationships",
    description: "Own your part and propose a next step.",
    prompt: `Role: Wise mediator helping me repair a relationship.

Context: I hurt [PERSON] by [ACTION]. I regret [SPECIFIC PART].

Goal: Draft a spoken apology outline: acknowledge impact, own my part, one concrete next step. No excuses.

Tone: Humble, brief.
Output: Bullet outline I can practice aloud.`,
    tags: ["apology", "repair"],
  },
  {
    id: "plan-goal-clarity",
    title: "Clarify a life goal",
    category: "planning",
    description: "From vague wish to clear direction.",
    prompt: `Role: Life planning coach for adults in midlife and beyond.

Context: I am considering [GOAL]. My constraints include [TIME, HEALTH, FAMILY, MONEY].

Goal: Help me clarify whether this goal fits my season of life. Give me reflection questions, not commands.

Output: 10 questions, then a one-paragraph summary of what you heard.
Ask clarifying questions first.`,
    tags: ["goals"],
  },
  {
    id: "plan-weekly-rhythm",
    title: "Gentle weekly rhythm",
    category: "planning",
    description: "A sustainable week template.",
    prompt: `Role: Practical planner who values rest and relationships.

Context: My week includes [WORK, FAMILY, CHURCH, HEALTH, etc.]. I have about [HOURS] of flexible time.

Goal: Suggest a gentle weekly rhythm (not a rigid schedule) with anchors for priorities and margin.

Tone: Encouraging, realistic.
Output: Table by day with morning/afternoon/evening themes.`,
    tags: ["weekly", "habits"],
  },
  {
    id: "plan-gentle-habit",
    title: "Start a habit without shame",
    category: "planning",
    description: "Small steps that stick.",
    prompt: `Role: Habit coach who avoids shame and hustle culture.

Context: I want to build a habit of [HABIT]. I have failed before because [REASON].

Goal: A 14-day starter plan with embarrassingly small steps and one celebration ritual.

Constraints: Max 15 minutes per day.
Tone: Kind and hopeful.`,
    tags: ["habits"],
  },
  {
    id: "analysis-decision-matrix",
    title: "Decision matrix with values",
    category: "analysis",
    description: "Pros, cons, and what matters most.",
    prompt: `Role: Decision-making coach.

Context: I am deciding between [OPTION A] and [OPTION B]. My top values are [VALUES].

Goal: Build a decision matrix, list blind spots, and suggest 3 questions to discuss with a trusted person.

Output: Table + short narrative summary.
Do not decide for me — help me think.`,
    tags: ["decisions"],
  },
  {
    id: "analysis-situation-map",
    title: "Map a complicated situation",
    category: "analysis",
    description: "Separate facts, feelings, and unknowns.",
    prompt: `Role: Clear-thinking facilitator.

Context: [Describe the situation — facts only first, then feelings]

Goal: Map facts, feelings, stakeholders, unknowns, and 3 possible next steps that are ethical and realistic.

Output: Sections with bullet points.`,
    tags: ["clarity"],
  },
  {
    id: "analysis-journal-questions",
    title: "Journaling questions for today",
    category: "analysis",
    description: "Process a day or season privately.",
    prompt: `Role: Reflective journaling guide.

Context: Today I felt [EMOTIONS] about [EVENT].

Goal: Give me 12 journaling questions — no advice yet — that help me process with honesty and self-compassion.

Tone: Quiet, wise, non-religious unless I ask otherwise.`,
    tags: ["journal"],
  },
  {
    id: "analysis-blind-spots",
    title: "Charitable blind-spot check",
    category: "analysis",
    description: "Gentle challenge to your thinking.",
    prompt: `Role: Wise friend who challenges thinking charitably.

Context: I believe [BELIEF / PLAN]. Here is my reasoning: [REASONING].

Goal: Point out 3 possible blind spots and 2 alternative views — without mocking me.

Tone: Respectful. End with one question I should sit with overnight.`,
    tags: ["thinking"],
  },
  {
    id: "work-email-clear",
    title: "Clear professional email",
    category: "work",
    description: "Human, professional, one call to action.",
    prompt: `Role: Professional writing assistant.

Context: I need to email [RECIPIENT] about [TOPIC]. Relationship: [client / colleague / vendor].

Goal: Draft an email under 150 words: clear subject line, purpose in line 1, bullets if needed, one call to action.

Tone: Warm and professional — not stiff.
Output: Subject + body.`,
    tags: ["email"],
  },
  {
    id: "work-meeting-agenda",
    title: "Meeting agenda",
    category: "work",
    description: "Respect time with a clear agenda.",
    prompt: `Role: Executive assistant.

Context: Meeting with [ATTENDEES] about [PURPOSE], [DURATION] minutes, on [DATE].

Goal: Create an agenda with time boxes, decisions needed, and pre-read suggestions.

Output: Copy-paste ready agenda.`,
    tags: ["meetings"],
  },
  {
    id: "work-client-followup",
    title: "Client follow-up",
    category: "work",
    description: "Personal touch without pressure.",
    prompt: `Role: Relationship-minded business communicator.

Context: Client [NAME], last project [PROJECT], I want to check in without being salesy.

Goal: 2 follow-up email options under 100 words referencing something specific.

Tone: Grateful, helpful.`,
    tags: ["sales", "clients"],
  },
  {
    id: "work-proposal-outline",
    title: "Proposal outline",
    category: "work",
    description: "Structure before you write the full doc.",
    prompt: `Role: Business writing strategist.

Context: I offer [SERVICE] to [CLIENT TYPE]. They need [OUTCOME].

Goal: Outline a 1-page proposal: problem, approach, timeline, investment, why us, next step.

Output: Section headings with 2–3 bullets each.`,
    tags: ["proposals"],
  },
  {
    id: "family-meeting-plan",
    title: "Family meeting plan",
    category: "family",
    description: "Organize a family conversation kindly.",
    prompt: `Role: Family meeting facilitator.

Context: We need to discuss [TOPIC] with [FAMILY MEMBERS]. Tensions include [IF ANY].

Goal: Agenda, ground rules, opening script, and closing with assigned action items.

Tone: Calm and inclusive.`,
    tags: ["family"],
  },
  {
    id: "family-gathering-checklist",
    title: "Holiday gathering checklist",
    category: "family",
    description: "Meals, travel, and hosting without chaos.",
    prompt: `Role: Event planner for family gatherings.

Context: [EVENT] on [DATE], [NUMBER] guests, I am [host / helper]. Dietary needs: [LIST].

Goal: Checklist by category (food, home, communication, timeline) working backward from event day.

Include a note for the host to rest.`,
    tags: ["holidays"],
  },
  {
    id: "family-caregiving-update",
    title: "Caregiving family update",
    category: "family",
    description: "Clear update to siblings or relatives.",
    prompt: `Role: Compassionate communicator for family caregiving.

Context: [LOVED ONE]'s health update: [FACTS]. I am the primary helper feeling [FEELINGS].

Goal: Draft a family update email: facts, current needs, specific asks, gratitude.

Tone: Honest, not guilt-driven. Under 300 words.`,
    tags: ["caregiving"],
  },
];

export function getPromptById(id: string): PromptCard | undefined {
  return promptLibrary.find((p) => p.id === id);
}

export function getPromptsByCategory(category: PromptCategory): PromptCard[] {
  return promptLibrary.filter((p) => p.category === category);
}
