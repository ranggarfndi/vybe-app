import { createHash, randomBytes } from "crypto";

/** Generate a secure anonymous session ID */
export function generateAnonSessionId(): string {
  return "anon_" + randomBytes(16).toString("hex");
}

/** Hash an anonymous session ID for storage (never store raw) */
export function hashAnonSessionId(sessionId: string): string {
  return createHash("sha256")
    .update(sessionId + (process.env.STORY_SIGNING_SECRET ?? ""))
    .digest("hex")
    .slice(0, 32);
}

export const ANON_SESSION_COOKIE = "vybe_anon_session";

export const ANON_SESSION_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 30, // 30 days
  path: "/",
};
