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
import {
  Clock,
  Library,
  FlaskConical,
  Sparkles,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
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

      <section className="mt-8">
        <SectionHeading
          title="Build your own prompts"
          description="Guided tools that turn everyday situations into clear, copy-ready ChatGPT prompts."
        />
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <FeaturedToolCard
            href="/app/prompt-lab"
            icon={FlaskConical}
            badge="Step by step"
            title="Prompt Lab"
            description="Fill in seven plain-English boxes — role, goal, context, and more. The Lab assembles a strong prompt you can paste into ChatGPT."
            cta="Open Prompt Lab"
            accent="sage"
          />
          <FeaturedToolCard
            href="/app/prompt-builder"
            icon={Sparkles}
            badge="From a rough idea"
            title="Master Prompt Builder"
            description="Describe your situation in everyday language. Get a polished master prompt ready to copy, with gentle follow-up questions built in."
            cta="Open Master Builder"
            accent="gold"
          />
        </div>
        <Link
          href="/app/prompts"
          className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-navy/10 bg-white px-5 py-4 transition-shadow hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <Library className="h-8 w-8 shrink-0 text-sage-dark" aria-hidden />
            <div>
              <p className="text-lg font-medium text-navy">Prompt library</p>
              <p className="text-base text-muted">
                Browse copy-ready examples by topic — relationships, work, planning, and more.
              </p>
            </div>
          </div>
          <ArrowRight className="h-6 w-6 shrink-0 text-sage-dark" aria-hidden />
        </Link>
      </section>

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
    </div>
  );
}

function FeaturedToolCard({
  href,
  icon: Icon,
  badge,
  title,
  description,
  cta,
  accent,
}: {
  href: string;
  icon: LucideIcon;
  badge: string;
  title: string;
  description: string;
  cta: string;
  accent: "sage" | "gold";
}) {
  const ringClass = accent === "sage" ? "ring-sage/30" : "ring-gold/40";
  const bgClass = accent === "sage" ? "from-white to-sage/10" : "from-white to-gold/10";
  const iconClass = accent === "sage" ? "text-sage-dark" : "text-gold-dark";

  return (
    <Link href={href} className="group block h-full">
      <Card
        className={`h-full bg-gradient-to-br ${bgClass} ring-2 ${ringClass} transition-shadow group-hover:shadow-lg`}
        padding="lg"
      >
        <Badge variant={accent === "sage" ? "sage" : "gold"} className="mb-4">
          {badge}
        </Badge>
        <Icon className={`mb-4 h-10 w-10 ${iconClass}`} aria-hidden />
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="mt-3 text-base leading-relaxed">{description}</CardDescription>
        <span className="mt-6 inline-flex items-center gap-2 text-lg font-medium text-sage-dark group-hover:underline">
          {cta}
          <ArrowRight className="h-5 w-5" aria-hidden />
        </span>
      </Card>
    </Link>
  );
}
