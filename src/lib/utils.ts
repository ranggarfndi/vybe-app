import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format relative time (e.g. "2 minutes ago") */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Validate Spotify track/album/playlist URL */
export function isValidSpotifyUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "open.spotify.com") return false;
    if (!parsed.protocol.startsWith("https")) return false;
    const validPaths = ["/track/", "/album/", "/playlist/"];
    return validPaths.some((path) => parsed.pathname.startsWith(path));
  } catch {
    return false;
  }
}

/** Extract Spotify track ID from URL */
export function extractSpotifyId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) return parts[1];
    return null;
  } catch {
    return null;
  }
}

/** Validate VYBE username */
export function isValidUsername(username: string): boolean {
  return /^[a-z0-9_]{3,30}$/.test(username);
}

/** Normalize username to lowercase */
export function normalizeUsername(username: string): string {
  return username.toLowerCase().trim();
}

/** Reserved usernames that cannot be used */
export const RESERVED_USERNAMES = new Set([
  "admin",
  "api",
  "login",
  "register",
  "signup",
  "settings",
  "dashboard",
  "support",
  "help",
  "about",
  "privacy",
  "terms",
  "moderator",
  "vybe",
  "inbox",
  "create",
  "d",
  "u",
  "story",
  "explore",
  "trending",
]);

export function isReservedUsername(username: string): boolean {
  return RESERVED_USERNAMES.has(username.toLowerCase());
}

/** Generate anonymous session ID */
export function generateAnonSessionId(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return (
    "anon_" +
    Array.from(arr)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/** Get Instagram profile URL */
export function getInstagramUrl(username: string): string {
  const clean = username.replace(/^@/, "");
  return `https://instagram.com/${clean}`;
}

/** Get Spotify embed URL from track URL */
export function getSpotifyEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "open.spotify.com") return null;
    // Convert open.spotify.com/track/ID -> https://open.spotify.com/embed/track/ID
    const path = parsed.pathname; // e.g. /track/xyz
    return `https://open.spotify.com/embed${path}?utm_source=generator&theme=0`;
  } catch {
    return null;
  }
}
