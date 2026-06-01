import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { modules } from "@/content/modules";
import { BookOpen, Heart, Sparkles, Target } from "lucide-react";

const pillars = [
  {
    icon: Heart,
    title: "Better conversations",
    description:
      "Thoughtful messages, hard talks, and repair — with prompts that sound human.",
  },
  {
    icon: Target,
    title: "Clearer planning",
    description:
      "Goals, weekly rhythms, and decisions without a rigid productivity culture.",
  },
  {
    icon: BookOpen,
    title: "Copy-ready examples",
    description:
      "Prebuilt prompts you can paste into ChatGPT today — no theory lecture required.",
  },
  {
    icon: Sparkles,
    title: "Turn ideas into prompts",
    description:
      "Our Master Prompt Builder helps you go from a rough thought to a powerful prompt.",
  },
];

export default function HomePage() {
  const previewModules = modules.filter((m) => m.status === "available").slice(0, 6);

  return (
    <>
      <section className="border-b border-navy/10 bg-gradient-to-b from-white to-cream px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium tracking-widest text-sage-dark uppercase">
            AI for real life
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-navy md:text-5xl">
            Make ChatGPT useful today — without feeling dumb
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            PromptWise Academy is a calm, premium workshop for adults who want practical
            help with relationships, planning, work, family, and clearer thinking.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/signup" size="lg">
              Start learning calmly
            </ButtonLink>
            <ButtonLink href="/curriculum" variant="outline" size="lg">
              Preview the curriculum
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <SectionHeading
          eyebrow="Why this academy"
          title="Thoughtful, private, and practical"
          description="More like a life-strategy workshop than a flashy tech app. You are not behind — you are learning a tool that fits your season of life."
          align="center"
          className="mx-auto"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Card key={pillar.title} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sage/10">
                  <Icon className="h-6 w-6 text-sage-dark" />
                </div>
                <h3 className="font-serif text-lg text-navy">{pillar.title}</h3>
                <p className="mt-2 text-sm text-muted">{pillar.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="bg-white px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Curriculum"
            title="Real-life modules, not jargon"
            description="Short video lessons (coming soon), clear notes, and prompts you can copy immediately."
          />
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {previewModules.map((mod) => (
              <li key={mod.slug}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <h3 className="font-serif text-lg text-navy">{mod.title}</h3>
                  <p className="mt-2 text-sm text-muted">{mod.description}</p>
                </Card>
              </li>
            ))}
          </ul>
          <div className="mt-8 text-center">
            <ButtonLink href="/curriculum" variant="secondary">
              See full curriculum
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center md:py-20">
        <h2 className="font-serif text-3xl text-navy">Ready when you are</h2>
        <p className="mt-4 text-lg text-muted">
          One small win today is enough. We&apos;ll meet you with warmth, clarity, and
          copy-ready tools.
        </p>
        <ButtonLink href="/pricing" className="mt-8" size="lg">
          View calm, simple pricing
        </ButtonLink>
      </section>
    </>
  );
}
