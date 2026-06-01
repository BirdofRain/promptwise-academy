"use client";

import { useMemo, useState } from "react";
import { PromptCardItem } from "./prompt-card";
import { UpgradeCTA } from "@/components/app/upgrade-cta";
import {
  promptCategories,
  promptLibrary,
  type PromptCategory,
  type PromptDifficulty,
} from "@/content/prompt-library";

interface PromptLibraryBrowserProps {
  isPaid: boolean;
}

export function PromptLibraryBrowser({ isPaid }: PromptLibraryBrowserProps) {
  const [category, setCategory] = useState<PromptCategory | "all">("all");
  const [difficulty, setDifficulty] = useState<PromptDifficulty | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return promptLibrary.filter((card) => {
      if (category !== "all" && card.category !== category) return false;
      if (difficulty !== "all" && card.difficulty !== difficulty) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          card.title.toLowerCase().includes(q) ||
          card.description.toLowerCase().includes(q) ||
          card.tags?.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [category, difficulty, search]);

  const accessible = isPaid
    ? filtered.filter((c) => !c.comingSoon)
    : filtered.filter((c) => c.isFreeSample && !c.comingSoon);
  const locked = isPaid ? [] : filtered.filter((c) => !c.isFreeSample && !c.comingSoon);

  return (
    <div>
      <div className="space-y-4 rounded-xl border border-navy/10 bg-white p-5 md:p-6">
        <div>
          <label htmlFor="search" className="mb-2 block text-lg font-medium text-navy">
            Search prompts
          </label>
          <input
            id="search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Try: apology, email, weekly plan…"
            className="w-full rounded-lg border border-navy/15 bg-cream px-4 py-3 text-lg text-navy focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/30"
          />
        </div>

        <div>
          <p className="mb-2 text-lg font-medium text-navy">Category</p>
          <div className="flex flex-wrap gap-2">
            <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
              All
            </FilterChip>
            {promptCategories
              .filter((c) => !c.comingSoon)
              .map((cat) => (
                <FilterChip
                  key={cat.id}
                  active={category === cat.id}
                  onClick={() => setCategory(cat.id)}
                >
                  {cat.label}
                </FilterChip>
              ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-lg font-medium text-navy">Difficulty</p>
          <div className="flex flex-wrap gap-2">
            {(["all", "beginner", "guided", "advanced"] as const).map((d) => (
              <FilterChip
                key={d}
                active={difficulty === d}
                onClick={() => setDifficulty(d)}
              >
                {d === "all" ? "All levels" : d.charAt(0).toUpperCase() + d.slice(1)}
              </FilterChip>
            ))}
          </div>
        </div>
      </div>

      {!isPaid && (
        <p className="mt-6 text-lg text-muted">
          Free samples: {accessible.length} prompt{accessible.length === 1 ? "" : "s"} available
          to copy. Subscribe for the full library ({locked.length}+ more).
        </p>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {accessible.map((card) => (
          <PromptCardItem key={card.id} card={card} />
        ))}
      </div>

      {locked.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-2xl text-navy">Members-only prompts</h2>
          <p className="mt-2 text-lg text-muted">
            {locked.length} more prompts unlock with a membership.
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {locked.slice(0, 4).map((card) => (
              <div key={card.id} className="relative">
                <div className="pointer-events-none select-none opacity-40 blur-[2px]">
                  <PromptCardItem card={card} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <UpgradeCTA />
          </div>
        </section>
      )}

      {accessible.length === 0 && locked.length === 0 && (
        <p className="mt-8 text-center text-lg text-muted">No prompts match your filters.</p>
      )}
    </div>
  );
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-4 py-2.5 text-base font-medium transition-colors ${
        active
          ? "bg-navy text-cream"
          : "border border-navy/15 bg-cream text-navy hover:bg-cream-dark"
      }`}
    >
      {children}
    </button>
  );
}
