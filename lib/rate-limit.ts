type WindowConfig = {
  windowMs: number;
  max: number;
};

const buckets = new Map<string, { count: number; resetAt: number }>();

function getKey(scope: string, id: string) {
  return `${scope}:${id}`;
}

export function rateLimit(
  scope: string,
  id: string,
  cfg?: Partial<WindowConfig>
) {
  const windowMs = cfg?.windowMs ?? 60_000; // 1 minute
  const max = cfg?.max ?? 10; // 10 requests per window
  const now = Date.now();
  const key = getKey(scope, id);
  const entry = buckets.get(key);
  if (!entry || now >= entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1, resetAt: now + windowMs };
  }
  if (entry.count >= max) {
    return { ok: false, remaining: 0, resetAt: entry.resetAt };
  }
  entry.count += 1;
  return { ok: true, remaining: max - entry.count, resetAt: entry.resetAt };
}

export function ipFromRequestHeaders(headers: Headers) {
  const xfwd = headers.get("x-forwarded-for");
  if (xfwd) return xfwd.split(",")[0].trim();
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp;
  return "anon";
}
