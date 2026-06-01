import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VideoPlaceholder } from "@/components/lesson/video-placeholder";
import { ChatGPTCallout } from "@/components/lesson/chatgpt-callout";
import { ExamplePromptsSection } from "@/components/lesson/example-prompts-section";
import { MarkCompleteButton } from "@/components/lesson/mark-complete-button";
import { getLessonBySlug, getLessonsByModule } from "@/content/lessons";
import { getModuleBySlug } from "@/content/modules";
import { getPromptById, type PromptCard } from "@/content/prompt-library";
import { UpgradeCTA } from "@/components/app/upgrade-cta";
import { isLessonComplete } from "@/lib/progress/compute";
import { getCurrentUser } from "@/lib/auth/session";
import { canAccessFullLesson, getLessonGateMessage } from "@/lib/entitlements";
import type { Metadata } from "next";

interface LessonPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  return { title: lesson?.title ?? "Lesson" };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) notFound();

  const mod = getModuleBySlug(lesson.moduleSlug);
  const moduleLessons = getLessonsByModule(lesson.moduleSlug);
  const lessonIndex = moduleLessons.findIndex((l) => l.slug === slug);
  const nextLesson = moduleLessons[lessonIndex + 1];
  const prevLesson = lessonIndex > 0 ? moduleLessons[lessonIndex - 1] : null;
  const complete = await isLessonComplete(slug);
  const user = await getCurrentUser();
  const hasFullAccess = canAccessFullLesson(user, slug);

  const relatedPrompts: PromptCard[] = lesson.relatedPromptIds
    .map((id) => getPromptById(id))
    .filter((p): p is PromptCard => p != null && !p.comingSoon);

  const primaryPrompt = relatedPrompts[0]?.prompt;
  const paragraphs = lesson.body.split("\n\n").filter(Boolean);
  const previewParagraph = paragraphs[0];

  if (!hasFullAccess) {
    return (
      <article className="app-readable max-w-3xl">
        <Link
          href={mod ? `/app/modules/${mod.slug}` : "/app"}
          className="text-lg font-medium text-sage-dark hover:underline"
        >
          ← Back
        </Link>
        <Badge variant="gold" className="mt-5">
          Members only
        </Badge>
        <h1 className="mt-4 font-serif text-3xl text-navy">{lesson.title}</h1>
        <p className="mt-3 text-xl text-muted">{lesson.summary}</p>
        {previewParagraph && (
          <Card className="mt-8" padding="lg">
            <p className="text-sm font-medium uppercase tracking-wide text-muted">Preview</p>
            <p className="mt-3 text-lg text-muted">{previewParagraph}</p>
          </Card>
        )}
        <div className="mt-8">
          <UpgradeCTA description={getLessonGateMessage(slug)} />
        </div>
      </article>
    );
  }

  return (
    <article className="app-readable max-w-3xl">
      <Link
        href={mod ? `/app/modules/${mod.slug}` : "/app/lessons"}
        className="text-lg font-medium text-sage-dark hover:underline"
      >
        ← {mod ? mod.title : "All lessons"}
      </Link>

      {mod && (
        <Badge variant="sage" className="mt-5">
          {mod.title}
        </Badge>
      )}

      <h1 className="mt-4 font-serif text-3xl leading-tight text-navy md:text-4xl">
        {lesson.title}
      </h1>

      <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-navy">Lesson summary</h2>
        <p className="mt-2 text-xl leading-relaxed text-muted">{lesson.summary}</p>
        <p className="mt-3 text-base text-muted">
          About {lesson.durationMinutes} minutes · Lesson {lessonIndex + 1} of{" "}
          {moduleLessons.length}
        </p>
      </section>

      <div className="mt-8">
        <VideoPlaceholder title={lesson.title} durationMinutes={lesson.durationMinutes} />
      </div>

      <section className="prose-lesson mt-10 text-xl leading-relaxed text-muted">
        {paragraphs.map((para) => (
          <p key={para.slice(0, 32)} className="mb-5">
            {para}
          </p>
        ))}
      </section>

      <Card className="mt-10" padding="lg">
        <h2 className="font-serif text-2xl text-navy">Key ideas</h2>
        <ul className="mt-4 list-disc space-y-3 pl-6 text-lg text-muted">
          {lesson.takeaways.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Card>

      <div className="mt-10">
        <ChatGPTCallout promptText={primaryPrompt} />
      </div>

      <ExamplePromptsSection prompts={relatedPrompts} />

      <div className="mt-12 space-y-6 border-t border-navy/10 pt-10">
        <MarkCompleteButton lessonSlug={slug} initialComplete={complete} />

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {prevLesson && (
            <ButtonLink href={`/app/lessons/${prevLesson.slug}`} variant="outline" size="lg">
              ← Previous lesson
            </ButtonLink>
          )}
          {nextLesson ? (
            <ButtonLink href={`/app/lessons/${nextLesson.slug}`} size="lg">
              Next lesson →
            </ButtonLink>
          ) : (
            <ButtonLink href={mod ? `/app/modules/${mod.slug}` : "/app"} variant="secondary" size="lg">
              Back to module
            </ButtonLink>
          )}
        </div>
      </div>
    </article>
  );
}
