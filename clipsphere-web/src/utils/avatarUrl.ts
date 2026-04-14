import api from "@/services/api";

const TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  url: string | null;
  fetchedAt: number;
}

const cache = new Map<string, CacheEntry>();

/**
 * Get a presigned avatar URL for a user.
 * Results are cached in-memory with a 5-minute TTL.
 */
export async function getAvatarUrl(
  userId: string
): Promise<string | null> {
  const entry = cache.get(userId);
  if (entry && Date.now() - entry.fetchedAt < TTL_MS) {
    return entry.url;
  }

  try {
    const { data } = await api.get(`/users/${userId}/avatar`);
    const url: string | null = data?.data?.url ?? null;
    cache.set(userId, { url, fetchedAt: Date.now() });
    return url;
  } catch {
    cache.set(userId, { url: null, fetchedAt: Date.now() });
    return null;
  }
}

/**
 * Invalidate the cached avatar for a user.
 * Call after a successful avatar upload to ensure fresh display.
 */
export function invalidateAvatarCache(userId: string): void {
  cache.delete(userId);
}
