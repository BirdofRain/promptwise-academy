import { getLessonBySlug } from "@/content/lessons";
import type { PromptCard } from "@/content/prompt-library";
import type { UserAccess } from "@/lib/user-access";
import { hasPaidAccess } from "@/lib/auth/session";
import type { SessionUser } from "@/lib/auth/types";

/** Lessons free accounts can open fully */
export const FREE_PREVIEW_LESSON_SLUGS = [
  "welcome-to-chatgpt",
  "your-first-conversation",
] as const;

export function isPreviewLesson(slug: string): boolean {
  return (FREE_PREVIEW_LESSON_SLUGS as readonly string[]).includes(slug);
}

/** Prefer getCurrentUserAccess() + these helpers for server-side paywall checks. */
export function canAccessFullLessonFromAccess(access: UserAccess, lessonSlug: string): boolean {
  if (access.paid) return true;
  return isPreviewLesson(lessonSlug);
}

export function canAccessPromptLabFromAccess(access: UserAccess): boolean {
  return access.paid;
}

export function canAccessMasterBuilderFromAccess(access: UserAccess): boolean {
  return access.paid;
}

export function canAccessPromptCardFromAccess(access: UserAccess, card: PromptCard): boolean {
  if (access.paid) return true;
  if (card.comingSoon) return false;
  return Boolean(card.isFreeSample);
}

export function filterPromptsForAccess<T extends PromptCard>(
  access: UserAccess,
  cards: T[],
): { accessible: T[]; locked: T[] } {
  const accessible: T[] = [];
  const locked: T[] = [];
  for (const card of cards) {
    if (canAccessPromptCardFromAccess(access, card)) accessible.push(card);
    else locked.push(card);
  }
  return { accessible, locked };
}

export function canAccessModuleLessonsFromAccess(access: UserAccess, moduleSlug: string): boolean {
  if (access.paid) return true;
  return moduleSlug === "start-here";
}

/** @deprecated Prefer canAccessFullLessonFromAccess with getCurrentUserAccess() */
export function canAccessFullLesson(user: SessionUser | null, lessonSlug: string): boolean {
  if (hasPaidAccess(user)) return true;
  return isPreviewLesson(lessonSlug);
}

/** @deprecated Prefer canAccessPromptLabFromAccess with getCurrentUserAccess() */
export function canAccessPromptLab(user: SessionUser | null): boolean {
  return hasPaidAccess(user);
}

/** @deprecated Prefer canAccessMasterBuilderFromAccess with getCurrentUserAccess() */
export function canAccessMasterBuilder(user: SessionUser | null): boolean {
  return hasPaidAccess(user);
}

/** @deprecated Prefer canAccessPromptCardFromAccess with getCurrentUserAccess() */
export function canAccessPromptCard(user: SessionUser | null, card: PromptCard): boolean {
  if (hasPaidAccess(user)) return true;
  if (card.comingSoon) return false;
  return Boolean(card.isFreeSample);
}

export function filterPromptsForUser<T extends PromptCard>(
  user: SessionUser | null,
  cards: T[],
): { accessible: T[]; locked: T[] } {
  const accessible: T[] = [];
  const locked: T[] = [];
  for (const card of cards) {
    if (canAccessPromptCard(user, card)) accessible.push(card);
    else locked.push(card);
  }
  return { accessible, locked };
}

/** @deprecated Prefer canAccessModuleLessonsFromAccess with getCurrentUserAccess() */
export function canAccessModuleLessons(user: SessionUser | null, moduleSlug: string): boolean {
  if (hasPaidAccess(user)) return true;
  return moduleSlug === "start-here";
}

export function getLessonGateMessage(lessonSlug: string): string {
  const lesson = getLessonBySlug(lessonSlug);
  return lesson
    ? `Unlock the full academy to access "${lesson.title}" and all lessons.`
    : "Unlock the full academy to access this lesson.";
}
