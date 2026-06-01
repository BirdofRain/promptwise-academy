/** Cookie name for mock session when AUTH_MODE=mock */
export const SESSION_COOKIE_NAME = "pw_session";

/** mock = dev cookie auth | authjs = Auth.js + Prisma */
export const AUTH_MODE = process.env.AUTH_MODE ?? "mock";

export const USE_MOCK_AUTH = AUTH_MODE === "mock";

export const PAID_STATUSES = ["active", "trialing"] as const;
