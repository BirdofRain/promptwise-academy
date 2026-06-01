import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { ModuleCard } from "@/components/course/module-card";
import { ProgressBar } from "@/components/course/progress-bar";
import { getCourseProgress } from "@/lib/progress/compute";
import { getSession } from "@/lib/auth/session";
import { getLessonBySlug } from "@/content/lessons";
import { modules } from "@/content/modules";
import { Clock, Library, FlaskConical, Sparkles, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Course dashboard",
};

export default async function AppDashboardPage() {
  const session = await getSession();
  const progress = await getCourseProgress();
  const continueLesson = progress.continueLessonSlug
    ? getLessonBySlug(progress.continueLessonSlug)
    : null;

  const comingSoonModules = modules.filter((m) => m.status === "coming_soon");

  return (
    <div className="app-readable">
      <p className="text-lg text-sage-dark">
        Welcome back{session?.user.name ? `, ${session.user.name}` : ""}
      </p>
      <h1 className="mt-2 font-serif text-3xl text-navy md:text-4xl">Your course dashboard</h1>
      <p className="mt-3 max-w-2xl text-xl text-muted">
        Learn at your own pace. One lesson or one copied prompt is a real win today.
      </p>

      <Card padding="lg" className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-lg font-medium text-navy">Overall progress</p>
            <p className="mt-1 text-base text-muted">
              {progress.completedCount} of {progress.totalCount} lessons complete
            </p>
          </div>
          <span className="flex items-center gap-2 text-base text-muted">
            <Clock className="h-5 w-5" aria-hidden />~{progress.estimatedMinutesRemaining} min
            remaining
          </span>
        </div>
        <ProgressBar percent={progress.percent} className="mt-4" size="lg" />
      </Card>

      {continueLesson && (
        <Card className="mt-6 border-sage/30 bg-gradient-to-r from-white to-sage/5" padding="lg">
          <Badge variant="sage" className="mb-3">
            Continue learning
          </Badge>
          <CardTitle className="text-2xl">{continueLesson.title}</CardTitle>
          <CardDescription className="mt-2 text-lg">{continueLesson.summary}</CardDescription>
          <p className="mt-2 text-base text-muted">
            About {continueLesson.durationMinutes} minutes
          </p>
          <ButtonLink href={`/app/lessons/${continueLesson.slug}`} size="lg" className="mt-5">
            Continue this lesson
          </ButtonLink>
        </Card>
      )}

      <section className="mt-12">
        <SectionHeading title="Your learning modules" />
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {progress.modules.map((mp) => (
            <ModuleCard key={mp.module.slug} progress={mp} />
          ))}
        </div>
      </section>

      {comingSoonModules.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-2xl text-navy">Coming soon</h2>
          <ul className="mt-4 space-y-3">
            {comingSoonModules.map((mod) => (
              <li key={mod.slug}>
                <Card padding="md" className="opacity-75">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-lg font-medium text-navy">{mod.title}</p>
                    <Badge variant="muted">Coming soon</Badge>
                  </div>
                  <p className="mt-1 text-base text-muted">{mod.description}</p>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-12">
        <h2 className="font-serif text-2xl text-navy">Quick tools</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <ToolLink
            href="/app/prompts"
            icon={Library}
            title="Prompt library"
            description="Copy-ready examples"
          />
          <ToolLink
            href="/app/prompt-lab"
            icon={FlaskConical}
            title="Prompt Lab"
            description="Build with the 7-part formula"
          />
          <ToolLink
            href="/app/prompt-builder"
            icon={Sparkles}
            title="Master builder"
            description="Rough idea → master prompt"
          />
        </div>
      </section>
    </div>
  );
}

function ToolLink({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Link href={href} className="block">
      <Card className="h-full transition-shadow hover:shadow-md" padding="lg">
        <Icon className="mb-3 h-7 w-7 text-sage-dark" aria-hidden />
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="mt-2 text-base">{description}</CardDescription>
      </Card>
    </Link>
  );
}
