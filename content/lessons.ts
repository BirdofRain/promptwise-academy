export interface Lesson {
  slug: string;
  moduleSlug: string;
  title: string;
  summary: string;
  durationMinutes: number;
  order: number;
  takeaways: string[];
  body: string;
  relatedPromptIds: string[];
}

export const lessons: Lesson[] = [
  // Start Here
  {
    slug: "welcome-to-chatgpt",
    moduleSlug: "start-here",
    title: "Welcome — ChatGPT Is a Thoughtful Assistant, Not a Test",
    summary:
      "What ChatGPT is, what it is not, and how to use it with confidence and calm.",
    durationMinutes: 8,
    order: 1,
    takeaways: [
      "ChatGPT works best when you give context and a clear goal.",
      "You can always ask it to simplify or try again.",
      "Your dignity matters — you are learning a tool, not proving your worth.",
    ],
    body: `Many people feel behind on AI. You are not behind — you are arriving at the right time for you.

ChatGPT is a conversational assistant. Think of it as a patient writing partner who never gets tired of drafts. It does not replace wisdom, relationships, or faith. It helps you think, plan, and communicate more clearly when you guide it well.

In this academy, we focus on real life: conversations, planning, decisions, family, and work. You will copy prompts, practice gently, and build confidence one step at a time.`,
    relatedPromptIds: ["basics-first-win"],
  },
  {
    slug: "your-first-conversation",
    moduleSlug: "start-here",
    title: "Your First Conversation — Three Sentences That Work",
    summary: "A simple pattern anyone can use today.",
    durationMinutes: 10,
    order: 2,
    takeaways: [
      "Start with role + situation + what you want.",
      "Ask for a specific format (bullets, steps, draft).",
      "End with: “Ask me 3 clarifying questions before you answer.”",
    ],
    body: `Open ChatGPT and try this pattern:

1. **Role:** “Act as a calm, practical coach…”
2. **Context:** “I am preparing for…”
3. **Goal:** “Help me…”

That is enough for a strong first result. We will refine this with the Prompt Formula in a later lesson.`,
    relatedPromptIds: ["basics-clarifying-questions"],
  },
  {
    slug: "privacy-and-safety",
    moduleSlug: "start-here",
    title: "Privacy, Safety, and Good Judgment",
    summary: "What to share, what to avoid, and when to talk to a real person.",
    durationMinutes: 7,
    order: 3,
    takeaways: [
      "Avoid sharing passwords, account numbers, or private medical details.",
      "Use ChatGPT for drafts and thinking — verify important facts.",
      "For crisis or abuse, contact a trusted person or professional immediately.",
    ],
    body: `ChatGPT is helpful, but it is not a doctor, lawyer, therapist, or pastor. Use it to organize your thoughts and draft words — then use human judgment for important decisions.

When in doubt, leave out identifying details. You can describe a situation without names or addresses.`,
    relatedPromptIds: [],
  },
  {
    slug: "the-prompt-formula-overview",
    moduleSlug: "start-here",
    title: "The Prompt Formula — Your Seven-Part Checklist",
    summary: "Role, Context, Goal, Constraints, Tone, Output, Follow-ups.",
    durationMinutes: 12,
    order: 4,
    takeaways: [
      "Great prompts read like a brief to a thoughtful helper.",
      "You do not need all seven parts every time — use what fits.",
      "The Prompt Lab and Master Builder apply this formula for you.",
    ],
    body: `Throughout PromptWise Academy, we use a simple framework:

1. **Role** — Who should ChatGPT be?
2. **Context** — What is going on?
3. **Goal** — What do you want?
4. **Constraints** — Limits, boundaries, what to avoid
5. **Tone** — Warm, direct, pastoral, professional…
6. **Output format** — Bullets, letter, step-by-step…
7. **Follow-up questions** — Ask before answering

Visit **Prompt Lab** in the app to fill these in guided fields.`,
    relatedPromptIds: ["basics-formula-practice"],
  },
  {
    slug: "copy-paste-workflow",
    moduleSlug: "start-here",
    title: "The Copy-and-Paste Workflow",
    summary: "How to use this academy alongside ChatGPT.",
    durationMinutes: 6,
    order: 5,
    takeaways: [
      "Copy a prompt from the library or builder.",
      "Paste into ChatGPT and answer any follow-up questions.",
      "Save what works in your own notes or Saved Prompts.",
    ],
    body: `You do not need to memorize prompts. This academy is designed for copy, paste, and gentle iteration.

After ChatGPT responds, you can say: “Make this warmer,” “Shorter,” or “Give me two alternatives.”`,
    relatedPromptIds: [],
  },
  {
    slug: "when-it-feels-overwhelming",
    moduleSlug: "start-here",
    title: "When It Feels Overwhelming",
    summary: "A reset for bad days and skeptical moments.",
    durationMinutes: 5,
    order: 6,
    takeaways: [
      "One small win is enough for today.",
      "Skepticism is healthy — test with low-stakes tasks first.",
      "Come back tomorrow; this will still be here.",
    ],
    body: `If technology frustrates you, you are normal. Pick one prompt from the library about something you already care about — a birthday message, a weekly plan, a kind email.

Success is not speed. Success is one useful result that makes tomorrow easier.`,
    relatedPromptIds: ["basics-low-stakes"],
  },
  // Relationships
  {
    slug: "thoughtful-message",
    moduleSlug: "relationship-prompts",
    title: "Write a Thoughtful Message",
    summary: "Texts and emails that sound like you — only clearer.",
    durationMinutes: 9,
    order: 1,
    takeaways: [
      "Give ChatGPT your relationship and intent.",
      "Ask for two tone options: warm and brief.",
      "Edit the final version in your own voice.",
    ],
    body: `Use the relationship prompts in the library for birthdays, encouragement, and “just thinking of you” messages. Always read aloud before sending.`,
    relatedPromptIds: ["rel-encouragement-text"],
  },
  {
    slug: "hard-conversation-prep",
    moduleSlug: "relationship-prompts",
    title: "Prepare for a Hard Conversation",
    summary: "Clarity without cruelty — boundaries and apologies.",
    durationMinutes: 11,
    order: 2,
    takeaways: [
      "Separate facts, feelings, and requests.",
      "Practice opening lines that invite dialogue.",
      "ChatGPT drafts; you choose what is true and kind.",
    ],
    body: `Hard conversations are human work. ChatGPT helps you prepare — it does not replace courage or listening.`,
    relatedPromptIds: ["rel-boundary-talk"],
  },
  {
    slug: "listening-and-reflecting",
    moduleSlug: "relationship-prompts",
    title: "Listen and Reflect Back",
    summary: "Understand someone else's perspective before you respond.",
    durationMinutes: 8,
    order: 3,
    takeaways: [
      "Summarize what you heard before offering solutions.",
      "Ask ChatGPT for reflective questions, not judgments.",
    ],
    body: `When someone is upset, they often need to feel heard first. Prompts in this module help you reflect without fixing too soon.`,
    relatedPromptIds: ["rel-reflective-listening"],
  },
  {
    slug: "repair-after-conflict",
    moduleSlug: "relationship-prompts",
    title: "Repair After Conflict",
    summary: "Apologies and next steps that rebuild trust.",
    durationMinutes: 10,
    order: 4,
    takeaways: [
      "Own your part without over-explaining.",
      "Offer one concrete next step.",
    ],
    body: `Repair takes time. Use drafts as a starting point, then speak in person when possible.`,
    relatedPromptIds: ["rel-apology-draft"],
  },
  // Life planning
  {
    slug: "clarify-a-life-goal",
    moduleSlug: "life-planning",
    title: "Clarify a Life Goal",
    summary: "Turn a vague wish into a clear direction.",
    durationMinutes: 9,
    order: 1,
    takeaways: ["Name the season you're in.", "Define success in plain language."],
    body: `Goals at 55 look different than goals at 25. Be honest about energy, obligations, and joy.`,
    relatedPromptIds: ["plan-goal-clarity"],
  },
  {
    slug: "weekly-rhythm",
    moduleSlug: "life-planning",
    title: "Design a Gentle Weekly Rhythm",
    summary: "A sustainable week — not a perfect planner.",
    durationMinutes: 8,
    order: 2,
    takeaways: ["Protect rest and relationships.", "Leave margin for real life."],
    body: `Ask for a weekly template you can actually follow. Adjust every Sunday night.`,
    relatedPromptIds: ["plan-weekly-rhythm"],
  },
  {
    slug: "decision-pros-cons",
    moduleSlug: "life-planning",
    title: "Decision-Making: Pros, Cons, and Values",
    summary: "Structured thinking for choices that matter.",
    durationMinutes: 10,
    order: 3,
    takeaways: ["List values before options.", "Ask what you might regret in 5 years."],
    body: `ChatGPT helps you see angles — you still decide with wisdom and prayer if that is your practice.`,
    relatedPromptIds: ["analysis-decision-matrix"],
  },
  {
    slug: "habit-without-shame",
    moduleSlug: "life-planning",
    title: "Build a Habit Without Shame",
    summary: "Small steps for health, learning, or creativity.",
    durationMinutes: 7,
    order: 4,
    takeaways: ["Start embarrassingly small.", "Celebrate showing up."],
    body: `Avoid prompts that sound like a drill sergeant. Ask for encouragement and realistic plans.`,
    relatedPromptIds: ["plan-gentle-habit"],
  },
  // Deep analysis
  {
    slug: "understand-a-situation",
    moduleSlug: "deep-analysis",
    title: "Understand a Complicated Situation",
    summary: "Map what happened, what matters, and what is unclear.",
    durationMinutes: 10,
    order: 1,
    takeaways: ["Separate facts from stories.", "Name what you do not know."],
    body: `Use analysis prompts when you feel stuck in circles. Write more context than feels necessary.`,
    relatedPromptIds: ["analysis-situation-map"],
  },
  {
    slug: "journaling-prompts",
    moduleSlug: "deep-analysis",
    title: "Journaling for Clarity",
    summary: "Questions that help you process a day or season.",
    durationMinutes: 8,
    order: 2,
    takeaways: ["Ask for questions, not lectures.", "Save answers in your own journal."],
    body: `Journaling is private. Do not paste your most sensitive entries if you are uncomfortable — summarize instead.`,
    relatedPromptIds: ["analysis-journal-questions"],
  },
  {
    slug: "second-opinion-thinking",
    moduleSlug: "deep-analysis",
    title: "A Calm “Second Opinion” on Your Thinking",
    summary: "Gentle challenges to blind spots.",
    durationMinutes: 9,
    order: 3,
    takeaways: ["Ask for charitable pushback.", "Request alternatives you have not considered."],
    body: `You are not looking for ChatGPT to be right — you are looking for clearer thinking.`,
    relatedPromptIds: ["analysis-blind-spots"],
  },
  // Work
  {
    slug: "professional-email",
    moduleSlug: "work-business",
    title: "Professional Email That Sounds Human",
    summary: "Clear, warm business communication.",
    durationMinutes: 8,
    order: 1,
    takeaways: ["State purpose in the first two lines.", "One clear call to action."],
    body: `Paste bullet points; ask for a polished draft. Edit to match your voice.`,
    relatedPromptIds: ["work-email-clear"],
  },
  {
    slug: "meeting-agenda",
    moduleSlug: "work-business",
    title: "Meeting Agendas and Follow-Ups",
    summary: "Respect everyone's time.",
    durationMinutes: 7,
    order: 2,
    takeaways: ["Agenda before meeting.", "Follow-up within 24 hours."],
    body: `Include attendees, decisions needed, and time limits in your prompt.`,
    relatedPromptIds: ["work-meeting-agenda"],
  },
  {
    slug: "client-follow-up",
    moduleSlug: "work-business",
    title: "Client Follow-Up That Feels Personal",
    summary: "Stay in touch without being pushy.",
    durationMinutes: 6,
    order: 3,
    takeaways: ["Reference something specific.", "Offer value, not pressure."],
    body: `Relationship beats tricks. Use prompts to sound like yourself.`,
    relatedPromptIds: ["work-client-followup"],
  },
  {
    slug: "proposal-outline",
    moduleSlug: "work-business",
    title: "Outline a Proposal or Offer",
    summary: "Structure before polish.",
    durationMinutes: 11,
    order: 4,
    takeaways: ["Problem, solution, proof, next step.", "Ask for an outline first, then expand."],
    body: `Two-step prompts work well: outline first, section drafts second.`,
    relatedPromptIds: ["work-proposal-outline"],
  },
  // Family
  {
    slug: "family-meeting-plan",
    moduleSlug: "family-home",
    title: "Plan a Family Conversation or Meeting",
    summary: "Schedules, caregiving, and expectations.",
    durationMinutes: 9,
    order: 1,
    takeaways: ["Name the purpose upfront.", "Assign one owner per action item."],
    body: `Family logistics are emotional. Prompts help you stay organized and kind.`,
    relatedPromptIds: ["family-meeting-plan"],
  },
  {
    slug: "gathering-checklist",
    moduleSlug: "family-home",
    title: "Gathering Checklist (Holidays and Visits)",
    summary: "Meals, travel, and who does what.",
    durationMinutes: 8,
    order: 2,
    takeaways: ["Work backward from the event date.", "Build in rest for hosts."],
    body: `Ask for categorized checklists you can print or share.`,
    relatedPromptIds: ["family-gathering-checklist"],
  },
  {
    slug: "caregiving-notes",
    moduleSlug: "family-home",
    title: "Caregiving Notes and Updates",
    summary: "Update siblings or family with clarity.",
    durationMinutes: 7,
    order: 3,
    takeaways: ["Facts first, feelings honored.", "Specific asks for help."],
    body: `Caregiving is heavy. Use ChatGPT to draft updates — lean on people too.`,
    relatedPromptIds: ["family-caregiving-update"],
  },
  // Prompt engineering simple
  {
    slug: "role-and-context",
    moduleSlug: "prompt-engineering-simple",
    title: "Role and Context — The Foundation",
    summary: "The two parts that fix most weak prompts.",
    durationMinutes: 8,
    order: 1,
    takeaways: ["Role sets expertise and stance.", "Context grounds the answer in your life."],
    body: `If results feel generic, you usually need richer context — not a fancier word.`,
    relatedPromptIds: ["basics-formula-practice"],
  },
  {
    slug: "tone-and-format",
    moduleSlug: "prompt-engineering-simple",
    title: "Tone and Output Format",
    summary: "Make responses feel right for the situation.",
    durationMinutes: 7,
    order: 2,
    takeaways: ["Tone prevents ‘corporate robot’ replies.", "Format saves editing time."],
    body: `Try: “Warm, plain language, no buzzwords, under 200 words, bullet points.”`,
    relatedPromptIds: [],
  },
  {
    slug: "follow-up-questions",
    moduleSlug: "prompt-engineering-simple",
    title: "Follow-Up Questions — Your Secret Weapon",
    summary: "Let ChatGPT interview you before it advises you.",
    durationMinutes: 6,
    order: 3,
    takeaways: [
      "End prompts with: “Ask me clarifying questions first.”",
      "Answer briefly, then ask for the final output.",
    ],
    body: `This one habit dramatically improves results for complex topics.`,
    relatedPromptIds: ["basics-clarifying-questions"],
  },
];

export function getLessonBySlug(slug: string): Lesson | undefined {
  return lessons.find((l) => l.slug === slug);
}

export function getLessonsByModule(moduleSlug: string): Lesson[] {
  return lessons
    .filter((l) => l.moduleSlug === moduleSlug)
    .sort((a, b) => a.order - b.order);
}

export function getAllLessonsSorted(): Lesson[] {
  return [...lessons].sort((a, b) => {
    if (a.moduleSlug !== b.moduleSlug) {
      return a.moduleSlug.localeCompare(b.moduleSlug);
    }
    return a.order - b.order;
  });
}
