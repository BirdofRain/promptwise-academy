import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { modules } from "@/content/modules";
import { getLessonsByModule } from "@/content/lessons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lessons",
};

export default function LessonsPage() {
  const teachingModules = modules.filter(
    (m) => m.status === "available" && m.lessonCount > 0,
  );

  return (
    <div>
      <SectionHeading
        title="Lessons"
        description="Short, calm lessons with notes you can read today. Video recordings are on the way."
      />

      <div className="mt-10 space-y-10">
        {teachingModules.map((mod) => {
          const moduleLessons = getLessonsByModule(mod.slug);
          return (
            <section key={mod.slug}>
              <h2 className="font-serif text-2xl text-navy">{mod.title}</h2>
              <p className="mt-1 text-muted">{mod.description}</p>
              <ul className="mt-4 space-y-3">
                {moduleLessons.map((lesson) => (
                  <li key={lesson.slug}>
                    <Link href={`/app/lessons/${lesson.slug}`}>
                      <Card className="transition-shadow hover:shadow-md">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <CardTitle className="text-lg">{lesson.title}</CardTitle>
                            <CardDescription className="mt-1">
                              {lesson.summary}
                            </CardDescription>
                          </div>
                          <Badge variant="muted">{lesson.durationMinutes} min</Badge>
                        </div>
                      </Card>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
