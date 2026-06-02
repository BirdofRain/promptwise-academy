"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
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

const categoryIds = new Set(promptCategories.map((c) => c.id));

function isPromptCategory(value: string): value is PromptCategory {
  return categoryIds.has(value as PromptCategory);
}

function categoryFromSearchParams(
  params: ReturnType<typeof useSearchParams>,
): PromptCategory | "all" {
  const fromUrl = params.get("category");
  if (fromUrl && isPromptCategory(fromUrl)) return fromUrl;
  return "all";
}

export function PromptLibraryBrowser({ isPaid }: PromptLibraryBrowserProps) {
  const searchParams = useSearchParams();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<PromptCategory | "all">(() =>
    categoryFromSearchParams(searchParams),
  );
  const [difficulty, setDifficulty] = useState<PromptDifficulty | "all">("all");
  const [search, setSearch] = useState("");
  const didScrollForUrl = useRef(false);

  const scrollToResults = useCallback(() => {
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const selectCategory = useCallback(
    (id: PromptCategory | "all") => {
      setCategory(id);
      scrollToResults();
    },
    [scrollToResults],
  );

  useEffect(() => {
    if (didScrollForUrl.current || category === "all") return;
    didScrollForUrl.current = true;
    scrollToResults();
  }, [category, scrollToResults]);

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

  const activeCategoryLabel =
    category === "all"
      ? null
      : promptCategories.find((c) => c.id === category)?.label;

  const visibleCategories = promptCategories.filter((c) => !c.comingSoon);

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

      <section className="mt-8" aria-label="Browse by topic">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-medium text-navy">Browse by topic</h2>
            <p className="mt-1 text-base text-muted">
              Tap a topic to jump to matching prompts below.
            </p>
          </div>
          {category !== "all" && (
            <button
              type="button"
              onClick={() => selectCategory("all")}
              className="text-base font-medium text-sage-dark underline hover:no-underline"
            >
              Show all topics
            </button>
          )}
        </div>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
          <CategoryJumpCard
            label="All topics"
            description="Every prompt in the library"
            active={category === "all"}
            onClick={() => selectCategory("all")}
          />
          {visibleCategories.map((cat) => (
            <CategoryJumpCard
              key={cat.id}
              label={cat.label}
              description={cat.description}
              active={category === cat.id}
              onClick={() => selectCategory(cat.id)}
            />
          ))}
        </div>
      </section>

      <div
        id="prompt-results"
        ref={resultsRef}
        className="mt-10 scroll-mt-24"
        tabIndex={-1}
      >
        {activeCategoryLabel && (
          <p className="mb-4 text-lg text-navy">
            Showing prompts in <strong>{activeCategoryLabel}</strong>
          </p>
        )}

        {!isPaid && (
          <p className="mb-4 text-lg text-muted">
            Free samples: {accessible.length} prompt{accessible.length === 1 ? "" : "s"}{" "}
            available to copy. Subscribe for the full library
            {locked.length > 0 ? ` (${locked.length}+ more in this view).` : "."}
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {accessible.map((card) => (
            <PromptCardItem key={card.id} card={card} />
          ))}
        </div>

        {accessible.length === 0 && locked.length === 0 && (
          <p className="py-8 text-center text-lg text-muted">No prompts match your filters.</p>
        )}

        {locked.length > 0 && (
          <section className="mt-12">
            <h3 className="font-serif text-2xl text-navy">Members-only prompts</h3>
            <p className="mt-2 text-lg text-muted">
              {locked.length} more prompts in this view unlock with a membership.
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
      </div>
    </div>
  );
}

function CategoryJumpCard({
  label,
  description,
  active,
  onClick,
}: {
  label: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-[11rem] max-w-[14rem] shrink-0 snap-start rounded-xl border p-4 text-left transition-shadow ${
        active
          ? "border-sage bg-sage/10 shadow-md ring-2 ring-sage/40"
          : "border-navy/10 bg-white hover:border-sage/40 hover:shadow-md"
      }`}
    >
      <p className="text-base font-medium text-navy">{label}</p>
      <p className="mt-1 line-clamp-2 text-sm text-muted">{description}</p>
    </button>
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
