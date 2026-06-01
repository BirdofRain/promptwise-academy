export type PromptCategory =
  | "relationships"
  | "apologies-hard-conversations"
  | "life-planning"
  | "deep-analysis"
  | "family-home"
  | "business-work"
  | "journaling-reflection"
  | "decision-making"
  | "future-spiritual"
  | "future-school"
  | "future-image-generation";

export type PromptDifficulty = "beginner" | "guided" | "advanced";

export interface PromptCard {
  id: string;
  title: string;
  category: PromptCategory;
  description: string;
  prompt: string;
  difficulty: PromptDifficulty;
  tags?: string[];
  comingSoon?: boolean;
  /** Free accounts can copy this prompt */
  isFreeSample?: boolean;
}

export const difficultyLabels: Record<PromptDifficulty, string> = {
  beginner: "Beginner",
  guided: "Guided",
  advanced: "Advanced",
};

export const promptCategories: {
  id: PromptCategory;
  label: string;
  description: string;
  comingSoon?: boolean;
}[] = [
  {
    id: "relationships",
    label: "Relationships",
    description: "Messages, connection, and everyday communication.",
  },
  {
    id: "apologies-hard-conversations",
    label: "Apologies & hard conversations",
    description: "Boundaries, repair, and difficult talks with dignity.",
  },
  {
    id: "life-planning",
    label: "Life planning",
    description: "Goals, rhythms, habits, and the season you're in.",
  },
  {
    id: "deep-analysis",
    label: "Deep analysis",
    description: "Understand complex situations and think more clearly.",
  },
  {
    id: "family-home",
    label: "Family & home organization",
    description: "Gatherings, caregiving, schedules, and household peace.",
  },
  {
    id: "business-work",
    label: "Business & work",
    description: "Emails, meetings, clients, and professional writing.",
  },
  {
    id: "journaling-reflection",
    label: "Journaling & reflection",
    description: "Private questions that help you process and grow.",
  },
  {
    id: "decision-making",
    label: "Decision-making",
    description: "Pros, cons, values, and choices that matter.",
  },
  {
    id: "future-spiritual",
    label: "Spiritual (coming soon)",
    description: "Faith-centered reflection and prayer journaling.",
    comingSoon: true,
  },
  {
    id: "future-school",
    label: "School & grandkids (coming soon)",
    description: "Homework help and encouraging young learners.",
    comingSoon: true,
  },
  {
    id: "future-image-generation",
    label: "Image generation (coming soon)",
    description: "Visuals for family projects and life celebrations.",
    comingSoon: true,
  },
];

export const promptLibrary: PromptCard[] = [
  // Relationships
  {
    id: "rel-encouragement-text",
    title: "Encouragement text to a friend",
    category: "relationships",
    difficulty: "beginner",
    description: "A sincere message without sounding cheesy.",
    prompt: `Role: Thoughtful friend helping me write a text message.

Context: My friend [NAME] is going through [SITUATION]. Our relationship is [close / casual / long-distance].

Goal: Write 2 versions of a short encouragement text (under 80 words each): one warm, one brief.

Tone: Sincere, not dramatic. No clichés.
Output: Label each version. Do not send — I will edit.`,
    tags: ["text", "friend"],
    isFreeSample: true,
  },
  {
    id: "rel-check-in-elder",
    title: "Check in with an aging parent",
    category: "relationships",
    difficulty: "guided",
    description: "A warm call or text that opens real conversation.",
    prompt: `Role: Compassionate communication coach.

Context: I want to check in on my [parent/relative] who is [situation]. I worry about [concern] but don't want to sound nosy.

Goal: Give me 3 opening lines for a phone call and a short follow-up text I could send afterward.

Tone: Warm, respectful of their dignity.
Ask me 2 clarifying questions first.`,
    tags: ["family", "parent"],
  },
  {
    id: "rel-reflective-listening",
    title: "Reflective listening practice",
    category: "relationships",
    difficulty: "guided",
    description: "Understand before you respond.",
    prompt: `Role: Listening coach.

Context: Someone said: "[QUOTE OR SUMMARY]". I tend to [fix / defend / withdraw].

Goal: Give me 5 reflective listening phrases I could use, and 3 questions that show curiosity without fixing.

Tone: Gentle and practical.`,
    tags: ["listening"],
  },
  {
    id: "rel-gratitude-letter",
    title: "Gratitude letter outline",
    category: "relationships",
    difficulty: "beginner",
    description: "Thank someone in a way that feels genuine.",
    prompt: `Role: Warm writing coach.

Context: I want to thank [PERSON] for [SPECIFIC THING THEY DID].

Goal: Outline a short gratitude letter (150–250 words): specific memory, impact on me, and a simple closing.

Tone: Sincere, not flowery.`,
    tags: ["gratitude"],
  },
  // Apologies & hard conversations
  {
    id: "rel-boundary-talk",
    title: "Prepare a boundary conversation",
    category: "apologies-hard-conversations",
    difficulty: "guided",
    description: "Clear, kind language for a difficult talk.",
    prompt: `Role: Communication coach for difficult but respectful conversations.

Context: I need to set a boundary with [PERSON] about [ISSUE]. I want to stay relational, not aggressive.

Goal: Help me prepare — opening line, 3 key points, and a closing that invites dialogue.

Constraints: No blaming language. Under 250 words for the spoken outline.
Tone: Firm and kind.
Ask me 4 clarifying questions first.`,
    tags: ["boundaries"],
  },
  {
    id: "rel-apology-draft",
    title: "Repair apology draft",
    category: "apologies-hard-conversations",
    difficulty: "guided",
    description: "Own your part and propose a next step.",
    prompt: `Role: Wise mediator helping me repair a relationship.

Context: I hurt [PERSON] by [ACTION]. I regret [SPECIFIC PART].

Goal: Draft a spoken apology outline: acknowledge impact, own my part, one concrete next step. No excuses.

Tone: Humble, brief.
Output: Bullet outline I can practice aloud.`,
    tags: ["apology", "repair"],
  },
  {
    id: "apology-written-letter",
    title: "Written apology letter",
    category: "apologies-hard-conversations",
    difficulty: "advanced",
    description: "When a conversation needs a thoughtful follow-up in writing.",
    prompt: `Role: Compassionate writing coach for reconciliation.

Context: I need to write to [PERSON] about [SITUATION]. My part in it: [YOUR PART]. What I hope for: [HOPE].

Goal: Draft a letter structure (not final prose): opening, acknowledgment, ownership, amends, invitation to respond.

Constraints: No defending, no "but you also." Under 400 words.
Tone: Humble, clear.`,
    tags: ["apology", "letter"],
  },
  {
    id: "hard-conversation-de-escalate",
    title: "De-escalate a heated moment",
    category: "apologies-hard-conversations",
    difficulty: "advanced",
    description: "Phrases to lower temperature and return to respect.",
    prompt: `Role: Conflict de-escalation coach.

Context: During a conversation about [TOPIC], things got heated. What happened: [BRIEF DESCRIPTION].

Goal: Give me 5 sentences I could say to pause, validate, and suggest a break — without surrendering my boundary.

Tone: Calm, dignified.`,
    tags: ["conflict"],
  },
  // Life planning
  {
    id: "basics-first-win",
    title: "Your first win — explain something simply",
    category: "life-planning",
    difficulty: "beginner",
    description: "Ask ChatGPT to teach you one thing in plain language.",
    prompt: `Act as a patient teacher for someone who is smart but new to ChatGPT.

Context: I want to understand [TOPIC] without jargon.

Goal: Explain it in simple language, then give me 3 practical ways I could use ChatGPT for this in everyday life.

Tone: Warm, respectful, never condescending.
Output: Short sections with bullet points.
Before you answer, ask me 2 clarifying questions.`,
    tags: ["starter"],
    isFreeSample: true,
  },
  {
    id: "plan-goal-clarity",
    title: "Clarify a life goal",
    category: "life-planning",
    difficulty: "guided",
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
    category: "life-planning",
    difficulty: "beginner",
    description: "A sustainable week template.",
    prompt: `Role: Practical planner who values rest and relationships.

Context: My week includes [WORK, FAMILY, CHURCH, HEALTH, etc.]. I have about [HOURS] of flexible time.

Goal: Suggest a gentle weekly rhythm (not a rigid schedule) with anchors for priorities and margin.

Tone: Encouraging, realistic.
Output: Table by day with morning/afternoon/evening themes.`,
    tags: ["weekly"],
    isFreeSample: true,
  },
  {
    id: "plan-gentle-habit",
    title: "Start a habit without shame",
    category: "life-planning",
    difficulty: "guided",
    description: "Small steps that stick.",
    prompt: `Role: Habit coach who avoids shame and hustle culture.

Context: I want to build a habit of [HABIT]. I have failed before because [REASON].

Goal: A 14-day starter plan with embarrassingly small steps and one celebration ritual.

Constraints: Max 15 minutes per day.
Tone: Kind and hopeful.`,
    tags: ["habits"],
  },
  {
    id: "plan-retirement-season",
    title: "Plan a meaningful retirement season",
    category: "life-planning",
    difficulty: "advanced",
    description: "Purpose, structure, and joy after a career transition.",
    prompt: `Role: Life transition coach for retirees and near-retirees.

Context: I recently [retired / reduced hours]. I feel [emotions]. I care about [values, family, faith, hobbies].

Goal: Help me draft 3 pillars for the next year (rhythm, relationships, growth) with weekly anchors — not a bucket list lecture.

Ask me 4 clarifying questions first.`,
    tags: ["retirement"],
  },
  // Deep analysis
  {
    id: "analysis-situation-map",
    title: "Map a complicated situation",
    category: "deep-analysis",
    difficulty: "guided",
    description: "Separate facts, feelings, and unknowns.",
    prompt: `Role: Clear-thinking facilitator.

Context: [Describe the situation — facts only first, then feelings]

Goal: Map facts, feelings, stakeholders, unknowns, and 3 possible next steps that are ethical and realistic.

Output: Sections with bullet points.`,
    tags: ["clarity"],
  },
  {
    id: "analysis-blind-spots",
    title: "Charitable blind-spot check",
    category: "deep-analysis",
    difficulty: "advanced",
    description: "Gentle challenge to your thinking.",
    prompt: `Role: Wise friend who challenges thinking charitably.

Context: I believe [BELIEF / PLAN]. Here is my reasoning: [REASONING].

Goal: Point out 3 possible blind spots and 2 alternative views — without mocking me.

Tone: Respectful. End with one question I should sit with overnight.`,
    tags: ["thinking"],
  },
  {
    id: "analysis-read-between-lines",
    title: "Understand what someone might mean",
    category: "deep-analysis",
    difficulty: "advanced",
    description: "Explore possibilities without jumping to conclusions.",
    prompt: `Role: Neutral communication analyst.

Context: Someone [said/did]: "[QUOTE OR ACTION]". Our relationship: [CONTEXT].

Goal: List 3 possible interpretations (charitable, neutral, cautious), what evidence supports each, and what I could ask to clarify — without diagnosing them.

Constraints: Do not tell me what they "really" think.`,
    tags: ["relationships"],
  },
  // Family & home
  {
    id: "family-meeting-plan",
    title: "Family meeting plan",
    category: "family-home",
    difficulty: "guided",
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
    category: "family-home",
    difficulty: "beginner",
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
    category: "family-home",
    difficulty: "guided",
    description: "Clear update to siblings or relatives.",
    prompt: `Role: Compassionate communicator for family caregiving.

Context: [LOVED ONE]'s health update: [FACTS]. I am the primary helper feeling [FEELINGS].

Goal: Draft a family update email: facts, current needs, specific asks, gratitude.

Tone: Honest, not guilt-driven. Under 300 words.`,
    tags: ["caregiving"],
  },
  {
    id: "family-home-weekly-reset",
    title: "Weekly home reset plan",
    category: "family-home",
    difficulty: "beginner",
    description: "A manageable tidying and planning routine.",
    prompt: `Role: Gentle home organizer.

Context: My home situation: [SIZE, WHO LIVES THERE, PAIN POINTS]. I have [TIME] per week.

Goal: A 60-minute weekly reset routine divided into zones — realistic, not Pinterest-perfect.

Tone: Encouraging.`,
    tags: ["home"],
  },
  // Business & work
  {
    id: "work-email-clear",
    title: "Clear professional email",
    category: "business-work",
    difficulty: "beginner",
    description: "Human, professional, one call to action.",
    prompt: `Role: Professional writing assistant.

Context: I need to email [RECIPIENT] about [TOPIC]. Relationship: [client / colleague / vendor].

Goal: Draft an email under 150 words: clear subject line, purpose in line 1, bullets if needed, one call to action.

Tone: Warm and professional — not stiff.
Output: Subject + body.`,
    tags: ["email"],
    isFreeSample: true,
  },
  {
    id: "work-meeting-agenda",
    title: "Meeting agenda",
    category: "business-work",
    difficulty: "beginner",
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
    category: "business-work",
    difficulty: "guided",
    description: "Personal touch without pressure.",
    prompt: `Role: Relationship-minded business communicator.

Context: Client [NAME], last project [PROJECT], I want to check in without being salesy.

Goal: 2 follow-up email options under 100 words referencing something specific.

Tone: Grateful, helpful.`,
    tags: ["clients"],
  },
  {
    id: "work-proposal-outline",
    title: "Proposal outline",
    category: "business-work",
    difficulty: "advanced",
    description: "Structure before you write the full document.",
    prompt: `Role: Business writing strategist.

Context: I offer [SERVICE] to [CLIENT TYPE]. They need [OUTCOME].

Goal: Outline a 1-page proposal: problem, approach, timeline, investment, why us, next step.

Output: Section headings with 2–3 bullets each.`,
    tags: ["proposals"],
  },
  // Journaling & reflection
  {
    id: "analysis-journal-questions",
    title: "Journaling questions for today",
    category: "journaling-reflection",
    difficulty: "beginner",
    description: "Process a day or season privately.",
    prompt: `Role: Reflective journaling guide.

Context: Today I felt [EMOTIONS] about [EVENT].

Goal: Give me 12 journaling questions — no advice yet — that help me process with honesty and self-compassion.

Tone: Quiet, wise.`,
    tags: ["journal"],
    isFreeSample: true,
  },
  {
    id: "journal-gratitude-deep",
    title: "Deep gratitude practice",
    category: "journaling-reflection",
    difficulty: "guided",
    description: "Move beyond a simple list to meaningful reflection.",
    prompt: `Role: Gratitude journaling guide.

Context: This week I noticed small good things: [LIST A FEW].

Goal: 8 prompts that help me go deeper — people, senses, surprises, and legacy — without toxic positivity.

Output: Numbered questions only.`,
    tags: ["gratitude"],
  },
  {
    id: "journal-life-season",
    title: "Reflect on your current life season",
    category: "journaling-reflection",
    difficulty: "guided",
    description: "Name what this chapter is teaching you.",
    prompt: `Role: Wise life reviewer for adults 45+.

Context: I am roughly [AGE/STAGE]. Major themes lately: [THEMES].

Goal: 10 journal prompts about gifts, griefs, unfinished business, and hopes — no advice until I answer.

Tone: Gentle, unhurried.`,
    tags: ["season"],
  },
  // Decision-making
  {
    id: "analysis-decision-matrix",
    title: "Decision matrix with values",
    category: "decision-making",
    difficulty: "guided",
    description: "Pros, cons, and what matters most.",
    prompt: `Role: Decision-making coach.

Context: I am deciding between [OPTION A] and [OPTION B]. My top values are [VALUES].

Goal: Build a decision matrix, list blind spots, and suggest 3 questions to discuss with a trusted person.

Output: Table + short narrative summary.
Do not decide for me — help me think.`,
    tags: ["decisions"],
  },
  {
    id: "decision-big-purchase",
    title: "Think through a major purchase",
    category: "decision-making",
    difficulty: "guided",
    description: "Car, home repair, vacation — with eyes open.",
    prompt: `Role: Practical financial thinking partner (not a licensed advisor).

Context: I am considering [PURCHASE] for [REASON]. Budget comfort: [RANGE]. Timeline: [WHEN].

Goal: Questions to ask myself, hidden costs to consider, and a 48-hour pause checklist.

Constraints: No specific investment advice. Encourage talking to spouse/advisor if needed.`,
    tags: ["money"],
  },
  {
    id: "decision-stay-or-change",
    title: "Stay or change course",
    category: "decision-making",
    difficulty: "advanced",
    description: "Job, church, city, relationship pattern — big forks in the road.",
    prompt: `Role: Discernment coach for major life decisions.

Context: I am weighing staying in [SITUATION] vs changing to [ALTERNATIVE]. Fears: [FEARS]. Hopes: [HOPES].

Goal: Help me separate fear from values, list what I'd need to make each path work, and suggest 5 questions for a trusted mentor.

Do not tell me what to do.`,
    tags: ["fork"],
  },
  // Meta / formula
  {
    id: "basics-clarifying-questions",
    title: "Ask clarifying questions first",
    category: "life-planning",
    difficulty: "beginner",
    description: "A habit that improves almost any ChatGPT conversation.",
    prompt: `I need your help with something important.

Before you give advice or a draft, ask me up to 5 clarifying questions — one at a time — so you understand my situation.

After I answer, provide your best response in plain, warm language.`,
    tags: ["formula"],
    isFreeSample: true,
  },
  {
    id: "basics-formula-practice",
    title: "Full Prompt Formula template",
    category: "life-planning",
    difficulty: "guided",
    description: "All seven parts — copy and fill in the brackets.",
    prompt: `Role: [Who should ChatGPT be?]

Context: [What is going on? 3–5 sentences]

Goal: [What do you want?]

Constraints: [What to avoid?]

Tone: [How should it sound?]

Output format: [Bullets, letter, steps, etc.]

Follow-up: Ask me 3 clarifying questions before your main answer.`,
    tags: ["formula"],
  },
  // Future placeholders
  {
    id: "future-spiritual-prayer-journal",
    title: "Prayer journaling prompts",
    category: "future-spiritual",
    difficulty: "guided",
    description: "Coming soon — faith-centered reflection with care and sensitivity.",
    comingSoon: true,
    prompt: `[Coming soon] Guided prompts for prayer journaling and spiritual reflection will appear here.`,
    tags: ["coming soon"],
  },
  {
    id: "future-school-homework",
    title: "Help grandkids with homework",
    category: "future-school",
    difficulty: "beginner",
    description: "Coming soon — encouraging learning without doing the work for them.",
    comingSoon: true,
    prompt: `[Coming soon] Prompts for supporting grandchildren with schoolwork — patiently and ethically.`,
    tags: ["coming soon"],
  },
  {
    id: "future-image-family-card",
    title: "Family announcement image ideas",
    category: "future-image-generation",
    difficulty: "beginner",
    description: "Coming soon — describe images for cards and celebrations.",
    comingSoon: true,
    prompt: `[Coming soon] Learn to describe images clearly for ChatGPT image tools.`,
    tags: ["coming soon"],
  },
];

export function getPromptById(id: string): PromptCard | undefined {
  return promptLibrary.find((p) => p.id === id);
}

export function getPromptsByCategory(category: PromptCategory): PromptCard[] {
  return promptLibrary.filter((p) => p.category === category);
}

export function getAvailablePrompts(): PromptCard[] {
  return promptLibrary.filter((p) => !p.comingSoon);
}
