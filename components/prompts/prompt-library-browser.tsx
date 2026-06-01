"use client";

import { useMemo, useState } from "react";
import { PromptCardItem } from "./prompt-card";
import {
  promptCategories,
  promptLibrary,
  type PromptCategory,
  type PromptDifficulty,
} from "@/content/prompt-library";

export function PromptLibraryBrowser() {
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
            {promptCategories.map((cat) => (
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

      <p className="mt-6 text-lg text-muted">
        Showing {filtered.length} prompt{filtered.length === 1 ? "" : "s"}
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {filtered.map((card) => (
          <PromptCardItem key={card.id} card={card} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-center text-lg text-muted">
          No prompts match your filters. Try clearing search or choosing a different category.
        </p>
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
