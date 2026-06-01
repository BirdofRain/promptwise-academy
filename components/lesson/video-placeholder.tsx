import { PlayCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface VideoPlaceholderProps {
  title?: string;
  durationMinutes?: number;
}

export function VideoPlaceholder({
  title = "Lesson video",
  durationMinutes,
}: VideoPlaceholderProps) {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="flex aspect-video flex-col items-center justify-center bg-gradient-to-br from-navy/5 via-cream-dark to-sage/10 px-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
          <PlayCircle className="h-9 w-9 text-sage-dark" strokeWidth={1.5} />
        </div>
        <p className="font-serif text-2xl text-navy">Video lesson coming soon</p>
        <p className="mt-3 max-w-md text-base text-muted">
          We&apos;re recording &ldquo;{title}&rdquo; with calm, step-by-step guidance.
          {durationMinutes ? ` (~${durationMinutes} min)` : ""} Read the lesson notes below
          while you wait.
        </p>
      </div>
    </Card>
  );
}
