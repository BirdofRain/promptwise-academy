import Link from "next/link";

const footerLinks = [
  { href: "/curriculum", label: "Curriculum" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/login", label: "Sign in" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-navy/10 bg-navy text-cream">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="font-serif text-2xl">PromptWise Academy</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-cream/80">
              Calm, practical ChatGPT skills for relationships, planning, work, and everyday
              life — without the tech-bro noise.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3" aria-label="Footer">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-cream/80 transition-colors hover:text-cream"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-10 border-t border-cream/10 pt-6 text-xs text-cream/60">
          © {new Date().getFullYear()} PromptWise Academy. Educational content only — not
          medical, legal, or mental health advice.
        </p>
      </div>
    </footer>
  );
}
