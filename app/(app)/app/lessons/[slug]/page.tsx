import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { VideoPlaceholder } from "@/components/lesson/video-placeholder";
import { getLessonBySlug, getLessonsByModule } from "@/content/lessons";
import { getModuleBySlug } from "@/content/modules";
import { getPromptById } from "@/content/prompt-library";
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
  const relatedPrompts = lesson.relatedPromptIds
    .map((id) => getPromptById(id))
    .filter(Boolean);

  const paragraphs = lesson.body.split("\n\n").filter(Boolean);

  return (
    <article>
      <Link
        href="/app/lessons"
        className="text-sm font-medium text-sage-dark hover:underline"
      >
        ← All lessons
      </Link>
      {mod && (
        <Badge variant="sage" className="mt-4">
          {mod.title}
        </Badge>
      )}
      <h1 className="mt-3 font-serif text-3xl text-navy md:text-4xl">{lesson.title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">{lesson.summary}</p>
      <p className="mt-2 text-sm text-muted">About {lesson.durationMinutes} minutes</p>

      <div className="mt-8">
        <VideoPlaceholder title={lesson.title} durationMinutes={lesson.durationMinutes} />
      </div>

      <section className="prose-lesson mt-10 max-w-2xl text-muted">
        {paragraphs.map((para) => (
          <p key={para.slice(0, 24)}>{para}</p>
        ))}
      </section>

      <Card className="mt-10 max-w-2xl">
        <h2 className="font-serif text-xl text-navy">Key takeaways</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
          {lesson.takeaways.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Card>

      {relatedPrompts.length > 0 && (
        <section className="mt-10">
          <h2 className="font-serif text-xl text-navy">Try these prompts</h2>
          <div className="mt-4 space-y-4">
            {relatedPrompts.map(
              (prompt) =>
                prompt && (
                  <Card key={prompt.id}>
                    <h3 className="font-medium text-navy">{prompt.title}</h3>
                    <p className="mt-1 text-sm text-muted">{prompt.description}</p>
                    <div className="mt-3">
                      <CopyButton text={prompt.prompt} />
                    </div>
                  </Card>
                ),
            )}
          </div>
        </section>
      )}

      <div className="mt-12 flex flex-wrap gap-3">
        {nextLesson ? (
          <ButtonLink href={`/app/lessons/${nextLesson.slug}`}>Next lesson</ButtonLink>
        ) : (
          <ButtonLink href="/app/lessons" variant="secondary">
            Back to lessons
          </ButtonLink>
        )}
        <ButtonLink href="/app/prompts" variant="outline">
          Browse prompt library
        </ButtonLink>
      </div>
    </article>
  );
}
