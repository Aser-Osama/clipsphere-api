"use client";

import { useCallback, useState } from "react";
import clsx from "clsx";
import api from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

interface LikeButtonProps {
  videoId: string;
  initialLikeCount?: number;
  initialLiked?: boolean;
}

export default function LikeButton({
  videoId,
  initialLikeCount = 0,
  initialLiked = false,
}: LikeButtonProps) {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);

  const toggle = useCallback(async () => {
    if (!isAuthenticated || loading) return;

    const wasLiked = liked;
    const prevCount = likeCount;

    // Optimistic update
    setLiked(!wasLiked);
    setLikeCount(wasLiked ? prevCount - 1 : prevCount + 1);
    setLoading(true);

    try {
      if (wasLiked) {
        const { data } = await api.delete(`/videos/${videoId}/like`);
        setLikeCount(data.data?.likeCount ?? prevCount - 1);
      } else {
        const { data } = await api.post(`/videos/${videoId}/like`);
        setLikeCount(data.data?.likeCount ?? prevCount + 1);
      }
    } catch (err: unknown) {
      // Handle 409 (already liked) — set as liked
      const status =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { status?: number } }).response?.status
          : undefined;
      if (status === 409) {
        setLiked(true);
        setLikeCount(prevCount);
      } else if (status === 404) {
        setLiked(false);
        setLikeCount(prevCount);
      } else {
        // Rollback
        setLiked(wasLiked);
        setLikeCount(prevCount);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, liked, likeCount, loading, videoId]);

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!isAuthenticated || loading}
      title={!isAuthenticated ? "Log in to like" : liked ? "Unlike" : "Like"}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all",
        liked
          ? "bg-red-50 text-red-600 hover:bg-red-100"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200",
        (!isAuthenticated || loading) && "cursor-not-allowed opacity-50"
      )}
    >
      <svg
        className={clsx("h-5 w-5", liked && "fill-red-500 text-red-500")}
        fill={liked ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={liked ? 0 : 2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
      <span>{likeCount}</span>
    </button>
  );
}
