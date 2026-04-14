"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import type { Video } from "@/types";

interface UserVideoGridProps {
  userId: string;
}

export default function UserVideoGrid({ userId }: UserVideoGridProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchVideos() {
      try {
        const { data } = await api.get(`/users/${userId}/videos`);
        if (!cancelled) setVideos(data.data ?? []);
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
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-brand-200 bg-brand-50/50 px-6 py-16 text-center">
        <svg
          className="mb-4 h-16 w-16 text-brand-300"
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
        <p className="text-lg font-semibold text-brand-800">Videos will appear here soon</p>
        <p className="mt-1 text-sm text-brand-600">This feature is under development.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((v) => (
        <a
          key={v._id}
          href={`/video/${v._id}`}
          className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
        >
          <div className="aspect-video bg-gray-100" />
          <div className="p-3">
            <h3 className="truncate text-sm font-medium text-gray-900 group-hover:text-brand-700">
              {v.title}
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              {v.viewsCount.toLocaleString()} views
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}
