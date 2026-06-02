import Link from "next/link";
import { FlaskConical, Sparkles, ArrowRight } from "lucide-react";

export function PromptLibraryTools() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ToolJumpCard
        href="/app/prompt-lab"
        icon={FlaskConical}
        title="Prompt Lab"
        description="Build a prompt step by step with plain-English boxes — then paste into ChatGPT."
        cta="Open Prompt Lab"
        accent="sage"
      />
      <ToolJumpCard
        href="/app/prompt-builder"
        icon={Sparkles}
        title="Master Prompt Builder"
        description="Describe your situation in everyday words and get a polished, customized prompt."
        cta="Customize a prompt"
        accent="gold"
      />
    </div>
  );
}

function ToolJumpCard({
  href,
  icon: Icon,
  title,
  description,
  cta,
  accent,
}: {
  href: string;
  icon: typeof FlaskConical;
  title: string;
  description: string;
  cta: string;
  accent: "sage" | "gold";
}) {
  const borderClass = accent === "sage" ? "border-sage/30 hover:border-sage/50" : "border-gold/30 hover:border-gold/50";
  const bgClass = accent === "sage" ? "bg-sage/5" : "bg-gold/5";
  const iconClass = accent === "sage" ? "text-sage-dark" : "text-gold-dark";

  return (
    <Link
      href={href}
      className={`group flex h-full flex-col rounded-xl border ${borderClass} ${bgClass} p-5 transition-shadow hover:shadow-md`}
    >
      <Icon className={`h-8 w-8 ${iconClass}`} aria-hidden />
      <p className="mt-3 text-lg font-medium text-navy">{title}</p>
      <p className="mt-1 flex-1 text-base text-muted">{description}</p>
      <span className="mt-4 inline-flex items-center gap-2 text-base font-medium text-sage-dark group-hover:underline">
        {cta}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </span>
    </Link>
  );
}
