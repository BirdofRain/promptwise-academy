import { cookies } from "next/headers";
import { PROGRESS_COOKIE_NAME } from "./constants";
import { prisma, isDatabaseConfigured } from "@/lib/db";
import { getUserId } from "@/lib/auth/session";
import { USE_MOCK_AUTH as MOCK_FLAG } from "@/lib/auth/constants";

const MAX_AGE = 60 * 60 * 24 * 365;

function parseCookieProgress(raw: string | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s): s is string => typeof s === "string");
  } catch {
    return [];
  }
}

async function getCookieProgress(): Promise<string[]> {
  const cookieStore = await cookies();
  return parseCookieProgress(cookieStore.get(PROGRESS_COOKIE_NAME)?.value);
}

async function setCookieProgress(slugs: string[]): Promise<void> {
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

async function getDbProgress(userId: string): Promise<string[]> {
  if (!isDatabaseConfigured()) return [];
  const rows = await prisma.lessonProgress.findMany({
    where: { userId },
    select: { lessonSlug: true },
  });
  return rows.map((r) => r.lessonSlug);
}

export async function getCompletedLessonSlugs(): Promise<string[]> {
  if (MOCK_FLAG) return getCookieProgress();

  const userId = await getUserId();
  if (userId && isDatabaseConfigured()) {
    return getDbProgress(userId);
  }
  return getCookieProgress();
}

export async function markLessonCompleteForUser(lessonSlug: string): Promise<void> {
  if (MOCK_FLAG) {
    const current = await getCookieProgress();
    if (!current.includes(lessonSlug)) {
      await setCookieProgress([...current, lessonSlug]);
    }
    return;
  }

  const userId = await getUserId();
  if (userId && isDatabaseConfigured()) {
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonSlug: { userId, lessonSlug },
      },
      create: { userId, lessonSlug },
      update: { completedAt: new Date() },
    });
    return;
  }

  const current = await getCookieProgress();
  if (!current.includes(lessonSlug)) {
    await setCookieProgress([...current, lessonSlug]);
  }
}

export async function unmarkLessonCompleteForUser(lessonSlug: string): Promise<void> {
  if (MOCK_FLAG) {
    const current = await getCookieProgress();
    await setCookieProgress(current.filter((s) => s !== lessonSlug));
    return;
  }

  const userId = await getUserId();
  if (userId && isDatabaseConfigured()) {
    await prisma.lessonProgress.deleteMany({
      where: { userId, lessonSlug },
    });
    return;
  }

  const current = await getCookieProgress();
  await setCookieProgress(current.filter((s) => s !== lessonSlug));
}
