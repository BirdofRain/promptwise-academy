import { cn } from "@/lib/utils";

interface ProgressBarProps {
  percent: number;
  className?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({ percent, className, label, size = "md" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  const heights = { sm: "h-2", md: "h-3", lg: "h-4" };

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="mb-2 flex justify-between text-base text-navy">
          <span>{label}</span>
          <span className="font-medium">{clamped}%</span>
        </div>
      )}
      <div
        className={cn("w-full overflow-hidden rounded-full bg-cream-dark", heights[size])}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? `Progress ${clamped} percent`}
      >
        <div
          className="h-full rounded-full bg-sage transition-all duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
