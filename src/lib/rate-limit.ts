// Simple in-memory rate limiter for MVP
// In production, use Redis or Upstash

interface RateLimitEntry {
  count: number;
  firstRequestAt: number;
}

const store = new Map<string, RateLimitEntry>();

interface RateLimitOptions {
  /** Max requests allowed in the window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(
  key: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.firstRequestAt > options.windowMs) {
    // Fresh window
    store.set(key, { count: 1, firstRequestAt: now });
    return {
      allowed: true,
      remaining: options.limit - 1,
      resetAt: now + options.windowMs,
    };
  }

  if (entry.count >= options.limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.firstRequestAt + options.windowMs,
    };
  }

  entry.count++;
  store.set(key, entry);

  return {
    allowed: true,
    remaining: options.limit - entry.count,
    resetAt: entry.firstRequestAt + options.windowMs,
  };
}

/** Rate limit for anonymous response submissions */
export function checkAnonResponseLimit(sessionHash: string): RateLimitResult {
  return checkRateLimit(`anon_response:${sessionHash}`, {
    limit: 5,
    windowMs: 10 * 60 * 1000, // 5 per 10 minutes
  });
}

/** Rate limit per IP (coarser, for abuse prevention) */
export function checkIpLimit(ip: string): RateLimitResult {
  return checkRateLimit(`ip:${ip}`, {
    limit: 20,
    windowMs: 60 * 60 * 1000, // 20 per hour
  });
}

/** Get client IP from request headers */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("cf-connecting-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}

// Clean up old entries periodically to prevent memory leak
setInterval(
  () => {
    const now = Date.now();
    const maxAge = 2 * 60 * 60 * 1000; // 2 hours
    for (const [key, entry] of store.entries()) {
      if (now - entry.firstRequestAt > maxAge) {
        store.delete(key);
      }
    }
  },
  30 * 60 * 1000 // every 30 min
);
