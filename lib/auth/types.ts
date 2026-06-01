export type SubscriptionStatus =
  | "none"
  | "active"
  | "trialing"
  | "canceled"
  | "past_due";

export type UserRole = "user" | "admin";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  subscriptionStatus: SubscriptionStatus;
}

export interface Session {
  user: SessionUser;
  expiresAt: string;
}
