import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 100 requests per 1 day
export const ratelimit = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN && process.env.UPSTASH_REDIS_REST_URL.startsWith("http")
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(100, "1 d"),
      analytics: true,
    })
  : null;

export async function checkRateLimit(identifier: string) {
  if (!ratelimit) {
    return { success: true };
  }
  return await ratelimit.limit(identifier);
}
