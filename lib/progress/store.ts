import { cookies } from "next/headers";
import { PROGRESS_COOKIE_NAME } from "./constants";

const MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function parseProgress(raw: string | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s): s is string => typeof s === "string");
  } catch {
    return [];
  }
}

export async function getCompletedLessonSlugs(): Promise<string[]> {
  const cookieStore = await cookies();
  return parseProgress(cookieStore.get(PROGRESS_COOKIE_NAME)?.value);
}

export async function setCompletedLessonSlugs(slugs: string[]): Promise<void> {
  const cookieStore = await cookies();
  const unique = [...new Set(slugs)];
  cookieStore.set(
    PROGRESS_COOKIE_NAME,
    encodeURIComponent(JSON.stringify(unique)),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: MAX_AGE,
      path: "/",
    },
  );
}
