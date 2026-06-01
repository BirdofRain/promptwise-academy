import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getAvailableModules } from "@/content/modules";
import { lessons } from "@/content/lessons";
import { getSession } from "@/lib/auth/session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function AppDashboardPage() {
  const session = await getSession();
  const firstLesson = lessons.find((l) => l.moduleSlug === "start-here");
  const modules = getAvailableModules().filter((m) => m.lessonCount > 0);

  return (
    <div>
      <p className="text-sm text-sage-dark">Welcome back{session?.user.name ? `, ${session.user.name}` : ""}</p>
      <h1 className="mt-1 font-serif text-3xl text-navy">Your academy dashboard</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Take your time. One lesson or one copied prompt is a real win today.
      </p>

      {firstLesson && (
        <Card className="mt-8 border-sage/30 bg-gradient-to-r from-white to-sage/5">
          <Badge variant="sage" className="mb-2">
            Continue
          </Badge>
          <CardTitle>{firstLesson.title}</CardTitle>
          <CardDescription className="mt-2">{firstLesson.summary}</CardDescription>
          <ButtonLink href={`/app/lessons/${firstLesson.slug}`} className="mt-4">
            Continue lesson
          </ButtonLink>
        </Card>
      )}

      <section className="mt-12">
        <h2 className="font-serif text-2xl text-navy">Quick tools</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Link href="/app/prompts" className="block">
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardTitle className="text-lg">Prompt library</CardTitle>
              <CardDescription>Copy-ready examples</CardDescription>
            </Card>
          </Link>
          <Link href="/app/prompt-lab" className="block">
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardTitle className="text-lg">Prompt Lab</CardTitle>
              <CardDescription>Guided fields → prompt</CardDescription>
            </Card>
          </Link>
          <Link href="/app/prompt-builder" className="block">
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardTitle className="text-lg">Master builder</CardTitle>
              <CardDescription>Rough idea → master prompt</CardDescription>
            </Card>
          </Link>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl text-navy">Your modules</h2>
        <ul className="mt-4 space-y-3">
          {modules.map((mod) => (
            <li key={mod.slug}>
              <Link href="/app/lessons">
                <Card className="transition-shadow hover:shadow-md">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg">{mod.title}</CardTitle>
                    <Badge variant="outline">{mod.lessonCount} lessons</Badge>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
