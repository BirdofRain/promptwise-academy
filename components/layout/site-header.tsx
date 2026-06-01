import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/session";

const marketingNav = [
  { href: "/curriculum", label: "Curriculum" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export async function SiteHeader({ variant = "marketing" }: { variant?: "marketing" | "app" }) {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-navy/10 bg-cream/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link href="/" className="group flex flex-col">
          <span className="font-serif text-xl text-navy transition-colors group-hover:text-sage-dark md:text-2xl">
            PromptWise Academy
          </span>
          <span className="text-xs tracking-wide text-muted">AI for real life</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {variant === "marketing" &&
            marketingNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-navy/80 transition-colors hover:text-navy"
              >
                {item.label}
              </Link>
            ))}
          {variant === "app" && (
            <>
              <Link href="/app" className="text-sm font-medium text-navy/80 hover:text-navy">
                Dashboard
              </Link>
              <Link href="/app/lessons" className="text-sm font-medium text-navy/80 hover:text-navy">
                Lessons
              </Link>
              <Link href="/app/prompts" className="text-sm font-medium text-navy/80 hover:text-navy">
                Prompt library
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <ButtonLink href="/app" variant="secondary" size="sm">
                My academy
              </ButtonLink>
              <ButtonLink href="/app/account" variant="ghost" size="sm" className="hidden sm:inline-flex">
                Account
              </ButtonLink>
            </>
          ) : (
            <>
              <ButtonLink href="/login" variant="ghost" size="sm">
                Sign in
              </ButtonLink>
              <ButtonLink href="/signup" variant="primary" size="sm">
                Get started
              </ButtonLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
