"use server";

import { revalidatePath } from "next/cache";
import { getCompletedLessonSlugs, setCompletedLessonSlugs } from "./store";

export async function markLessonComplete(lessonSlug: string) {
  const current = await getCompletedLessonSlugs();
  if (!current.includes(lessonSlug)) {
    await setCompletedLessonSlugs([...current, lessonSlug]);
  }
  revalidatePath("/app");
  revalidatePath("/app/lessons");
  revalidatePath(`/app/lessons/${lessonSlug}`);
  revalidatePath("/app/modules", "layout");
}

export async function unmarkLessonComplete(lessonSlug: string) {
  const current = await getCompletedLessonSlugs();
  await setCompletedLessonSlugs(current.filter((s) => s !== lessonSlug));
  revalidatePath("/app");
  revalidatePath("/app/lessons");
  revalidatePath(`/app/lessons/${lessonSlug}`);
}
