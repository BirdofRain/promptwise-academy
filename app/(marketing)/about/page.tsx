import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
      <SectionHeading
        eyebrow="About"
        title="Built for adults who deserve dignity in learning"
        description="PromptWise Academy exists because too many AI courses speak to twenty-something developers — not parents, grandparents, leaders, and everyday people with rich lives already."
      />

      <div className="prose-lesson mt-10 space-y-6 text-muted">
        <p>
          We believe ChatGPT can support clearer thinking, better conversations, and practical
          planning — when you know how to guide it with warmth and boundaries.
        </p>
        <p>
          This is not about becoming a “prompt engineer.” It is about having a private workshop
          in your pocket: examples you can copy, lessons you can take slowly, and tools that turn
          a rough idea into something you can paste into ChatGPT with confidence.
        </p>
      </div>

      <Card className="mt-10 border-gold/20 bg-gold/5">
        <h2 className="font-serif text-xl text-navy">A note on trust and safety</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          PromptWise Academy provides educational content only. It is not medical, legal,
          financial, or mental health advice. For crises, abuse, or emergencies, please contact
          a trusted person or qualified professional immediately. Use good judgment with anything
          you paste into ChatGPT — especially about private family matters.
        </p>
      </Card>
    </div>
  );
}
