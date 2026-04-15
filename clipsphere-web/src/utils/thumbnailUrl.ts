import api from "@/services/api";

const TTL_MS = 10 * 60 * 1000; // 10 minutes

interface CacheEntry {
  url: string | null;
  fetchedAt: number;
}

const cache = new Map<string, CacheEntry>();

export async function getThumbnailUrl(
  videoId: string
): Promise<string | null> {
  const entry = cache.get(videoId);
  if (entry && Date.now() - entry.fetchedAt < TTL_MS) {
    return entry.url;
  }

  try {
    const { data } = await api.get(`/videos/${videoId}/thumbnail`);
    const url: string | null = data?.data?.url ?? null;
    cache.set(videoId, { url, fetchedAt: Date.now() });
    return url;
  } catch {
    cache.set(videoId, { url: null, fetchedAt: Date.now() });
    return null;
  }
}
