/**
 * Auth.js (NextAuth v5) — see docs/AUTH.md for why we chose this stack.
 *
 * Production: AUTH_MODE=authjs + DATABASE_URL + AUTH_SECRET
 * Local UI-only: AUTH_MODE=mock (no database)
 */
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import type { SubscriptionStatus as PrismaSubStatus } from "@prisma/client";

export const AUTH_MODE = process.env.AUTH_MODE ?? "mock";
export const isAuthJsEnabled = AUTH_MODE === "authjs";

function mapSubscriptionStatus(
  status: PrismaSubStatus | null | undefined,
): "none" | "active" | "trialing" | "canceled" | "past_due" {
  switch (status) {
    case "ACTIVE":
      return "active";
    case "TRIALING":
      return "trialing";
    case "CANCELED":
      return "canceled";
    case "PAST_DUE":
      return "past_due";
    default:
      return "none";
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!isAuthJsEnabled) return null;

        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          include: { subscription: true },
        });
        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email.split("@")[0],
          role: user.role.toLowerCase(),
          subscriptionStatus: mapSubscriptionStatus(user.subscription?.status),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "user";
        token.subscriptionStatus =
          (user as { subscriptionStatus?: string }).subscriptionStatus ?? "none";
      }

      if (trigger === "update" && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          include: { subscription: true },
        });
        if (dbUser) {
          token.subscriptionStatus = mapSubscriptionStatus(dbUser.subscription?.status);
          token.role = dbUser.role.toLowerCase();
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;

        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          include: { subscription: true },
        });

        if (dbUser) {
          (session.user as { role: string }).role = dbUser.role.toLowerCase();
          (session.user as { subscriptionStatus: string }).subscriptionStatus =
            mapSubscriptionStatus(dbUser.subscription?.status);
        } else {
          (session.user as { role: string }).role = (token.role as string) ?? "user";
          (session.user as { subscriptionStatus: string }).subscriptionStatus =
            (token.subscriptionStatus as string) ?? "none";
        }
      }
      return session;
    },
  },
  trustHost: true,
});
