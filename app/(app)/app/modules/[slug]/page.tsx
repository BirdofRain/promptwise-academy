import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/course/progress-bar";
import { getModuleBySlug } from "@/content/modules";
import { getLessonsByModule } from "@/content/lessons";
import { getCourseProgress } from "@/lib/progress/compute";
import { getCurrentUserAccess } from "@/lib/user-access";
import { canAccessFullLessonFromAccess } from "@/lib/entitlements";
import { CheckCircle2, Circle, Lock, PlayCircle } from "lucide-react";
import type { Metadata } from "next";

interface ModulePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ModulePageProps): Promise<Metadata> {
  const { slug } = await params;
  const mod = getModuleBySlug(slug);
  return { title: mod?.title ?? "Module" };
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { slug } = await params;
  const mod = getModuleBySlug(slug);
  if (!mod || mod.status === "coming_soon") notFound();

  const moduleLessons = getLessonsByModule(slug);
  const progress = await getCourseProgress();
  const moduleProgress = progress.modules.find((m) => m.module.slug === slug);
  const access = await getCurrentUserAccess();

  return (
    <div className="app-readable">
      <Link
        href="/app"
        className="text-lg font-medium text-sage-dark hover:underline"
      >
        ← Course dashboard
      </Link>

      <h1 className="mt-4 font-serif text-3xl text-navy md:text-4xl">{mod.title}</h1>
      <p className="mt-3 max-w-2xl text-xl text-muted">{mod.description}</p>

      {moduleProgress && moduleProgress.totalCount > 0 && (
        <div className="mt-8 max-w-xl">
          <ProgressBar
            percent={moduleProgress.percent}
            label={`${moduleProgress.completedCount} of ${moduleProgress.totalCount} lessons complete`}
            size="lg"
          />
          <p className="mt-2 text-base text-muted">
            Estimated time for this module: ~{moduleProgress.estimatedMinutes} minutes
          </p>
        </div>
      )}

      <ul className="mt-10 space-y-4">
        {moduleLessons.map((lesson, index) => {
          const lessonProg = moduleProgress?.lessons.find((l) => l.slug === lesson.slug);
          const status = lessonProg?.status ?? "not_started";
          const canOpen = canAccessFullLessonFromAccess(access, lesson.slug);

          return (
            <li key={lesson.slug}>
              <Link href={`/app/lessons/${lesson.slug}`}>
                <Card className="transition-shadow hover:shadow-md" padding="lg">
                  <div className="flex gap-4">
                    <div className="mt-1 shrink-0">
                      {!canOpen ? (
                        <Lock className="h-7 w-7 text-gold-dark" aria-label="Members only" />
                      ) : status === "complete" ? (
                        <CheckCircle2 className="h-7 w-7 text-sage-dark" aria-label="Complete" />
                      ) : status === "in_progress" ? (
                        <PlayCircle className="h-7 w-7 text-gold-dark" aria-label="In progress" />
                      ) : (
                        <Circle className="h-7 w-7 text-navy/25" aria-label="Not started" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-muted">
                        Lesson {index + 1} · {lesson.durationMinutes} min
                      </p>
                      <CardTitle className="mt-1 text-xl">{lesson.title}</CardTitle>
                      <CardDescription className="mt-2 text-base">
                        {lesson.summary}
                      </CardDescription>
                      <div className="mt-3">
                        {status === "complete" && (
                          <Badge variant="sage">Complete</Badge>
                        )}
                        {status === "in_progress" && (
                          <Badge variant="gold">Continue here</Badge>
                        )}
                        {!canOpen && <Badge variant="gold">Preview / upgrade</Badge>}
                        {canOpen && status === "not_started" && (
                          <Badge variant="muted">Not started</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>

      {moduleLessons.length === 0 && (
        <p className="mt-8 text-lg text-muted">
          This module uses tools instead of video lessons. Visit the{" "}
          <Link href="/app/prompts" className="text-sage-dark underline">
            prompt library
          </Link>{" "}
          or{" "}
          <Link href="/app/prompt-builder" className="text-sage-dark underline">
            master builder
          </Link>
          .
        </p>
      )}
    </div>
  );
}
