import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { modules } from "@/content/modules";
import { getLessonsByModule } from "@/content/lessons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Curriculum",
};

export default function CurriculumPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <SectionHeading
        eyebrow="Curriculum"
        title="Everything included in your membership"
        description="Short lessons, copy-ready prompts, and guided tools — organized for real life, not computer science."
      />

      <div className="mt-12 space-y-6">
        {modules.map((mod) => {
          const moduleLessons = getLessonsByModule(mod.slug);
          const comingSoon = mod.status === "coming_soon";

          return (
            <Card key={mod.slug}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <CardTitle>{mod.title}</CardTitle>
                  <CardDescription className="mt-2">{mod.description}</CardDescription>
                </div>
                {comingSoon ? (
                  <Badge variant="muted">Coming soon</Badge>
                ) : (
                  <Badge variant="sage">
                    {moduleLessons.length > 0
                      ? `${moduleLessons.length} lessons`
                      : "Tools & library"}
                  </Badge>
                )}
              </div>

              {moduleLessons.length > 0 && (
                <ul className="mt-4 space-y-2 border-t border-navy/10 pt-4">
                  {moduleLessons.map((lesson) => (
                    <li key={lesson.slug} className="text-sm text-muted">
                      <span className="text-navy">{lesson.title}</span>
                      <span className="ml-2">· {lesson.durationMinutes} min</span>
                    </li>
                  ))}
                </ul>
              )}

              {!comingSoon && mod.slug === "start-here" && (
                <p className="mt-4 text-sm">
                  <Link href="/signup" className="font-medium text-sage-dark hover:underline">
                    Sign up to start with Start Here →
                  </Link>
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
