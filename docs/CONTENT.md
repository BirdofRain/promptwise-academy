# Content guide — PromptWise Academy

MVP content lives in **TypeScript files** under `content/`. There is no CMS yet — edit these files, save, commit, and deploy.

## Modules (`content/modules.ts`)

Each module:

```ts
{
  slug: "relationship-prompts",      // URL: /app/modules/relationship-prompts
  title: "Relationship Prompts",
  description: "Short summary for cards",
  order: 2,                            // Sort order on dashboard
  status: "available",                 // or "coming_soon"
  lessonCount: 4,                      // Display hint (keep in sync with lessons)
}
```

**Tips**

- Set `status: "coming_soon"` for future tracks (spiritual, school, images).
- Update `lessonCount` when you add/remove lessons in that module.

## Lessons (`content/lessons.ts`)

Each lesson:

```ts
{
  slug: "welcome-to-chatgpt",          // URL: /app/lessons/welcome-to-chatgpt
  moduleSlug: "start-here",            // Must match a module slug
  title: "Lesson title",
  summary: "One-line description",
  durationMinutes: 8,
  order: 1,                            // Order within the module
  takeaways: ["Key idea 1", "Key idea 2"],
  body: `Multi-paragraph markdown-ish text.\n\nSeparate paragraphs with blank lines.`,
  relatedPromptIds: ["basics-first-win"],  // IDs from prompt-library.ts
}
```

**Free preview lessons** (no membership required) are defined in `lib/entitlements.ts`:

```ts
export const FREE_PREVIEW_LESSON_SLUGS = [
  "welcome-to-chatgpt",
  "your-first-conversation",
];
```

Add a slug there to make a lesson free.

**Video:** Lesson pages show a “Video coming soon” placeholder. When ready, add `videoEmbedUrl` to the lesson type and render an iframe in `app/(app)/app/lessons/[slug]/page.tsx`.

## Prompt library (`content/prompt-library.ts`)

Each prompt card:

```ts
{
  id: "rel-encouragement-text",        // Unique — used in lesson relatedPromptIds
  title: "Encouragement text to a friend",
  category: "relationships",           // Must match a category id below
  difficulty: "beginner",              // beginner | guided | advanced
  description: "One line for the card",
  prompt: `Full text to copy into ChatGPT...`,
  tags: ["text", "friend"],            // Optional — used in search
  isFreeSample: true,                  // Optional — free users can copy
  comingSoon: true,                    // Optional — teaser only
}
```

Categories are listed in `promptCategories` in the same file. To add a category:

1. Extend the `PromptCategory` union type.
2. Add an entry to `promptCategories`.
3. Tag prompts with the new category id.

## Prompt Lab templates (`lib/prompt-lab.ts`)

The seven-field formula and examples live here. Adjust `formulaFields` help text or add `formulaExamples`.

## Checklist after editing content

1. Run `npm run lint` and `npm run build`.
2. Click through `/curriculum`, `/app`, and affected lesson URLs locally.
3. Commit with a clear message (e.g. “Add lesson on apologies”).

## Future: CMS

When you outgrow files, consider Sanity or Payload. Until then, seed files keep the MVP simple and version-controlled.
