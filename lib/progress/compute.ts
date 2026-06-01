import { getLessonsByModule, lessons } from "@/content/lessons";
import { modules, type Module } from "@/content/modules";
import { getCompletedLessonSlugs } from "./store";

export type LessonStatus = "not_started" | "in_progress" | "complete";

export interface LessonProgress {
  slug: string;
  status: LessonStatus;
}

export interface ModuleProgress {
  module: Module;
  lessons: LessonProgress[];
  completedCount: number;
  totalCount: number;
  percent: number;
  estimatedMinutes: number;
  status: "not_started" | "in_progress" | "complete" | "coming_soon";
}

export interface CourseProgress {
  completedCount: number;
  totalCount: number;
  percent: number;
  estimatedMinutesTotal: number;
  estimatedMinutesRemaining: number;
  modules: ModuleProgress[];
  continueLessonSlug: string | null;
}

function lessonStatus(slug: string, completed: Set<string>, isFirstIncomplete: boolean): LessonStatus {
  if (completed.has(slug)) return "complete";
  if (isFirstIncomplete) return "in_progress";
  return "not_started";
}

export async function getCourseProgress(): Promise<CourseProgress> {
  const completedSlugs = await getCompletedLessonSlugs();
  const completed = new Set(completedSlugs);

  const teachingModules = modules.filter((m) => m.lessonCount > 0);
  let continueLessonSlug: string | null = null;

  const moduleProgressList: ModuleProgress[] = teachingModules.map((mod) => {
    const moduleLessons = getLessonsByModule(mod.slug);
    const estimatedMinutes = moduleLessons.reduce((sum, l) => sum + l.durationMinutes, 0);

    if (mod.status === "coming_soon") {
      return {
        module: mod,
        lessons: [],
        completedCount: 0,
        totalCount: 0,
        percent: 0,
        estimatedMinutes: 0,
        status: "coming_soon" as const,
      };
    }

    const lessonProgress: LessonProgress[] = moduleLessons.map((lesson) => {
      const isFirstIncomplete =
        !completed.has(lesson.slug) && continueLessonSlug === null;
      if (isFirstIncomplete) continueLessonSlug = lesson.slug;
      const status = lessonStatus(lesson.slug, completed, isFirstIncomplete);
      return { slug: lesson.slug, status };
    });

    const completedCount = moduleLessons.filter((l) => completed.has(l.slug)).length;
    const totalCount = moduleLessons.length;
    const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    let moduleStatus: ModuleProgress["status"] = "not_started";
    if (completedCount === totalCount && totalCount > 0) moduleStatus = "complete";
    else if (completedCount > 0 || lessonProgress.some((l) => l.status === "in_progress"))
      moduleStatus = "in_progress";

    return {
      module: mod,
      lessons: lessonProgress,
      completedCount,
      totalCount,
      percent,
      estimatedMinutes,
      status: moduleStatus,
    };
  });

  const allTeachingLessons = lessons.filter((l) =>
    teachingModules.some((m) => m.slug === l.moduleSlug),
  );
  const totalCount = allTeachingLessons.length;
  const completedCount = allTeachingLessons.filter((l) => completed.has(l.slug)).length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const estimatedMinutesTotal = allTeachingLessons.reduce((s, l) => s + l.durationMinutes, 0);
  const estimatedMinutesRemaining = allTeachingLessons
    .filter((l) => !completed.has(l.slug))
    .reduce((s, l) => s + l.durationMinutes, 0);

  return {
    completedCount,
    totalCount,
    percent,
    estimatedMinutesTotal,
    estimatedMinutesRemaining,
    modules: moduleProgressList,
    continueLessonSlug,
  };
}

export async function isLessonComplete(slug: string): Promise<boolean> {
  const completed = await getCompletedLessonSlugs();
  return completed.includes(slug);
}
