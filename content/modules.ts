export type ModuleStatus = "available" | "coming_soon";

export interface Module {
  slug: string;
  title: string;
  description: string;
  order: number;
  status: ModuleStatus;
  lessonCount: number;
}

export const modules: Module[] = [
  {
    slug: "start-here",
    title: "Start Here: ChatGPT Basics for Normal People",
    description:
      "A calm introduction to ChatGPT — what it is, how to talk to it, and your first practical wins.",
    order: 1,
    status: "available",
    lessonCount: 6,
  },
  {
    slug: "relationship-prompts",
    title: "Relationship Prompts",
    description:
      "Better conversations, thoughtful messages, boundaries, and hard talks — with dignity.",
    order: 2,
    status: "available",
    lessonCount: 4,
  },
  {
    slug: "life-planning",
    title: "Life Planning Prompts",
    description:
      "Goals, weekly rhythms, decisions, and gentle accountability for the season you're in.",
    order: 3,
    status: "available",
    lessonCount: 4,
  },
  {
    slug: "deep-analysis",
    title: "Deep Analysis Prompts",
    description:
      "Clearer thinking, pros and cons, reflection, and understanding complex situations.",
    order: 4,
    status: "available",
    lessonCount: 3,
  },
  {
    slug: "work-business",
    title: "Work and Business Prompts",
    description:
      "Emails, meetings, clients, and everyday professional communication — without jargon.",
    order: 5,
    status: "available",
    lessonCount: 4,
  },
  {
    slug: "family-home",
    title: "Family and Home Prompts",
    description:
      "Schedules, gatherings, caregiving, and keeping home life organized and peaceful.",
    order: 6,
    status: "available",
    lessonCount: 3,
  },
  {
    slug: "prompt-engineering-simple",
    title: "Prompt Engineering Made Simple",
    description:
      "A human-friendly formula so you can build strong prompts on your own.",
    order: 7,
    status: "available",
    lessonCount: 3,
  },
  {
    slug: "prompt-library",
    title: "Prompt Library",
    description: "Copy-ready examples organized by real-life situations.",
    order: 8,
    status: "available",
    lessonCount: 0,
  },
  {
    slug: "master-prompt-builder",
    title: "Master Prompt Builder",
    description: "Turn a rough idea into a polished prompt you can paste into ChatGPT.",
    order: 9,
    status: "available",
    lessonCount: 0,
  },
  {
    slug: "spiritual-prompts",
    title: "Spiritual Prompts",
    description: "Faith-centered reflection and prayer journaling (coming soon).",
    order: 10,
    status: "coming_soon",
    lessonCount: 0,
  },
  {
    slug: "image-generation",
    title: "Image Generation",
    description: "Create helpful visuals for family and life projects (coming soon).",
    order: 11,
    status: "coming_soon",
    lessonCount: 0,
  },
  {
    slug: "school-grandkids",
    title: "School and Grandkids Help",
    description: "Support homework, learning, and encouragement (coming soon).",
    order: 12,
    status: "coming_soon",
    lessonCount: 0,
  },
];

export function getModuleBySlug(slug: string): Module | undefined {
  return modules.find((m) => m.slug === slug);
}

export function getAvailableModules(): Module[] {
  return modules.filter((m) => m.status === "available").sort((a, b) => a.order - b.order);
}
