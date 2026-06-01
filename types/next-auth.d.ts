import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      subscriptionStatus: "none" | "active" | "trialing" | "canceled" | "past_due";
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
    subscriptionStatus?: "none" | "active" | "trialing" | "canceled" | "past_due";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    subscriptionStatus?: string;
  }
}
