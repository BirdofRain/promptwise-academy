/** Cookie name for mock session; replace with Auth.js session when wired up. */
export const SESSION_COOKIE_NAME = "pw_session";

/** Set to false when Auth.js is configured. */
export const USE_MOCK_AUTH = true;

/** Mock users can access paid content when status is active or trialing. */
export const PAID_STATUSES = ["active", "trialing"] as const;
