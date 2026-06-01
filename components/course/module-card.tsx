import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "./progress-bar";
import type { ModuleProgress } from "@/lib/progress/compute";
import { Clock } from "lucide-react";

const statusLabels: Record<ModuleProgress["status"], string> = {
  not_started: "Not started",
  in_progress: "In progress",
  complete: "Complete",
  coming_soon: "Coming soon",
};

const statusBadge: Record<ModuleProgress["status"], "muted" | "gold" | "sage" | "outline"> = {
  not_started: "muted",
  in_progress: "gold",
  complete: "sage",
  coming_soon: "outline",
};

export function ModuleCard({ progress }: { progress: ModuleProgress }) {
  const { module: mod, percent, estimatedMinutes, totalCount, status } = progress;
  const href =
    status === "coming_soon" ? undefined : `/app/modules/${mod.slug}`;

  const content = (
    <Card
      className={`h-full ${href ? "transition-shadow hover:shadow-md" : "opacity-75"}`}
      padding="lg"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <Badge variant={statusBadge[status]}>{statusLabels[status]}</Badge>
        {totalCount > 0 && (
          <span className="flex items-center gap-1.5 text-base text-muted">
            <Clock className="h-4 w-4" aria-hidden />
            ~{estimatedMinutes} min
          </span>
        )}
      </div>
      <CardTitle className="mt-4 text-xl">{mod.title}</CardTitle>
      <CardDescription className="mt-2 text-base">{mod.description}</CardDescription>

      {totalCount > 0 && (
        <div className="mt-6">
          <ProgressBar
            percent={percent}
            label={`${progress.completedCount} of ${totalCount} lessons`}
            size="lg"
          />
        </div>
      )}

      {href && (
        <p className="mt-4 text-base font-medium text-sage-dark">View lessons →</p>
      )}
    </Card>
  );

  if (!href) return <div>{content}</div>;
  return <Link href={href}>{content}</Link>;
}
