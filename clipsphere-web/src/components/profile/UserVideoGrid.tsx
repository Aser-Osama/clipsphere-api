"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import type { Video } from "@/types";
import { getThumbnailUrl } from "@/utils/thumbnailUrl";

interface UserVideoGridProps {
  userId: string;
}

function VideoThumb({ video }: { video: Video }) {
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (video.thumbnailKey) {
      getThumbnailUrl(video._id).then((url) => {
        if (!cancelled) setThumbUrl(url);
      });
    }
    return () => { cancelled = true; };
  }, [video._id, video.thumbnailKey]);

  if (thumbUrl) {
    return (
      <img
        src={thumbUrl}
        alt={video.title}
        className="aspect-video w-full object-cover"
      />
    );
  }

  // Gradient fallback (same seed logic as VideoCard)
  const hue = parseInt(video._id.slice(-6), 16) % 360;
  return (
    <div
      className="aspect-video w-full"
      style={{ background: `linear-gradient(135deg, hsl(${hue},60%,25%) 0%, hsl(${(hue + 40) % 360},50%,15%) 100%)` }}
    />
  );
}

export default function UserVideoGrid({ userId }: UserVideoGridProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchVideos() {
      try {
        const { data } = await api.get(`/users/${userId}/videos`);
        if (!cancelled) setVideos(data.data?.videos ?? data.data ?? []);
      } catch {
        if (!cancelled) setVideos([]);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }

    fetchVideos();
    return () => { cancelled = true; };
  }, [userId]);

  if (!loaded) return null;

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-2/50 px-6 py-16 text-center">
        <svg
          className="mb-4 h-16 w-16 text-brand-500/30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 13.5 5.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
        <p className="text-lg font-semibold text-text-strong font-display">Videos will appear here soon</p>
        <p className="mt-1 text-sm text-text-muted">This feature is under development.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((v) => (
        <a
          key={v._id}
          href={`/video/${v._id}`}
          className="group overflow-hidden rounded-xl border border-border bg-surface transition-all hover:border-border-accent"
        >
          <div className="overflow-hidden">
            <VideoThumb video={v} />
          </div>
          <div className="p-3">
            <h3 className="truncate text-sm font-medium text-text-strong group-hover:text-brand-400">
              {v.title}
            </h3>
            <p className="mt-1 text-xs text-text-muted">
              {v.viewsCount.toLocaleString()} views
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}
