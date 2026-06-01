import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCourseProgress } from "@/lib/progress/compute";
import { ButtonLink } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All lessons",
};

export default async function LessonsPage() {
  const progress = await getCourseProgress();
  const teachingModules = progress.modules.filter((m) => m.totalCount > 0);

  return (
    <div className="app-readable">
      <SectionHeading
        title="All lessons"
        description="Browse every module from one place, or use the course dashboard for progress at a glance."
      />
      <ButtonLink href="/app" variant="outline" size="lg" className="mt-4">
        ← Course dashboard
      </ButtonLink>

      <div className="mt-10 space-y-8">
        {teachingModules.map((mp) => (
          <section key={mp.module.slug}>
            <Link href={`/app/modules/${mp.module.slug}`}>
              <h2 className="font-serif text-2xl text-navy hover:text-sage-dark">
                {mp.module.title}
              </h2>
            </Link>
            <p className="mt-1 text-lg text-muted">{mp.module.description}</p>
            <p className="mt-2 text-base text-muted">
              {mp.completedCount}/{mp.totalCount} complete · ~{mp.estimatedMinutes} min
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
