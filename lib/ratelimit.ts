import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

type RateLimitOptions = {
  routeKey: string;
  limit: number;
  windowSeconds: number;
};

const isEnabled = process.env.RATE_LIMIT_ENABLED !== "false";
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const redisClient = isEnabled && redisUrl && redisToken
  ? new Redis({ url: redisUrl, token: redisToken })
  : null;

const limiterCache = new Map<string, Ratelimit>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get("x-real-ip");
  return real?.trim() || "unknown";
}

function getLimiter(limit: number, windowSeconds: number): Ratelimit | null {
  if (!redisClient) return null;
  const key = `${limit}:${windowSeconds}`;
  const cached = limiterCache.get(key);
  if (cached) return cached;
  const limiter = new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
  });
  limiterCache.set(key, limiter);
  return limiter;
}

export async function enforceRateLimit(
  request: Request,
  options: RateLimitOptions
): Promise<NextResponse | null> {
  if (!isEnabled || !redisClient) {
    return null;
  }

  const limiter = getLimiter(options.limit, options.windowSeconds);
  if (!limiter) {
    return null;
  }

  const ip = getClientIp(request);
  const result = await limiter.limit(`${options.routeKey}:${ip}`);
  if (!result.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }
  return null;
}

