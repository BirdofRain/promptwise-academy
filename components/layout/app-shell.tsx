import Link from "next/link";
import type { ReactNode } from "react";
import {
  BookOpen,
  FlaskConical,
  Home,
  Library,
  Sparkles,
  User,
} from "lucide-react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { href: "/app", label: "Dashboard", icon: Home },
  { href: "/app/lessons", label: "Lessons", icon: BookOpen },
  { href: "/app/prompts", label: "Prompt library", icon: Library },
  { href: "/app/prompt-lab", label: "Prompt Lab", icon: FlaskConical },
  { href: "/app/prompt-builder", label: "Master builder", icon: Sparkles },
  { href: "/app/account", label: "Account", icon: User },
];

export function AppShell({
  children,
  currentPath,
}: {
  children: ReactNode;
  currentPath?: string;
}) {
  return (
    <div className="flex min-h-full flex-col bg-cream">
      <SiteHeader variant="app" />
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-0 px-4 py-8 md:gap-8 md:px-6">
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="sticky top-8 space-y-1" aria-label="Academy">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const active =
                currentPath === link.href ||
                (link.href !== "/app" && currentPath?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors",
                    active
                      ? "bg-white text-navy shadow-sm"
                      : "text-navy/70 hover:bg-white/60 hover:text-navy",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <SiteFooter />
    </div>
  );
}
