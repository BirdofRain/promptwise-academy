"use server";

import { revalidatePath } from "next/cache";
import {
  markLessonCompleteForUser,
  unmarkLessonCompleteForUser,
} from "./store";

export async function markLessonComplete(lessonSlug: string) {
  await markLessonCompleteForUser(lessonSlug);
  revalidatePath("/app");
  revalidatePath("/app/lessons");
  revalidatePath(`/app/lessons/${lessonSlug}`);
  revalidatePath("/app/modules", "layout");
}

export async function unmarkLessonComplete(lessonSlug: string) {
  await unmarkLessonCompleteForUser(lessonSlug);
  revalidatePath("/app");
  revalidatePath("/app/lessons");
  revalidatePath(`/app/lessons/${lessonSlug}`);
}
