"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { markLessonComplete, unmarkLessonComplete } from "@/lib/progress/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MarkCompleteButtonProps {
  lessonSlug: string;
  initialComplete: boolean;
}

export function MarkCompleteButton({
  lessonSlug,
  initialComplete,
}: MarkCompleteButtonProps) {
  const [complete, setComplete] = useState(initialComplete);
  const [isPending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      if (complete) {
        await unmarkLessonComplete(lessonSlug);
        setComplete(false);
      } else {
        await markLessonComplete(lessonSlug);
        setComplete(true);
      }
    });
  }

  return (
    <Button
      type="button"
      variant={complete ? "secondary" : "outline"}
      size="lg"
      onClick={toggle}
      disabled={isPending}
      className={cn("w-full sm:w-auto", complete && "border-sage")}
    >
      {complete ? (
        <>
          <CheckCircle2 className="mr-2 h-5 w-5" aria-hidden />
          Completed — click to undo
        </>
      ) : (
        <>
          <Circle className="mr-2 h-5 w-5" aria-hidden />
          Mark lesson complete
        </>
      )}
    </Button>
  );
}
