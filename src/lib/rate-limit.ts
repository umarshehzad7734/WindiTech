/**
 * Fixed-window rate limiter held in process memory.
 *
 * This is deliberately simple: it stops a single client hammering the contact
 * endpoint, which is what the form actually needs. It does NOT survive a
 * restart and is not shared between server instances — if you deploy to more
 * than one instance, put a shared store (Redis/Upstash) behind this interface.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
/** Guard against unbounded growth if the process is long-lived and busy. */
const MAX_TRACKED_KEYS = 10_000;

type Entry = { count: number; resetAt: number };

const hits = new Map<string, Entry>();

function sweep(now: number) {
  for (const [key, entry] of hits) {
    if (entry.resetAt <= now) hits.delete(key);
  }
}

export function checkRateLimit(key: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || entry.resetAt <= now) {
    if (hits.size >= MAX_TRACKED_KEYS) sweep(now);
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Best-effort client identifier from proxy headers. */
export function clientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
