"use client";

import { useState } from "react";
import clsx from "clsx";
import api from "@/services/api";

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  onToggle: () => void;
}

export default function FollowButton({ userId, isFollowing, onToggle }: FollowButtonProps) {
  const [loading, setLoading] = useState(false);
  const [optimistic, setOptimistic] = useState(isFollowing);

  async function handleClick() {
    setLoading(true);
    const prev = optimistic;
    setOptimistic(!prev);

    try {
      if (prev) {
        await api.delete(`/users/${userId}/unfollow`);
      } else {
        await api.post(`/users/${userId}/follow`);
      }
      onToggle();
    } catch {
      setOptimistic(prev);
    } finally {
      setLoading(false);
    }
  }

  // Keep optimistic state in sync when parent updates
  if (optimistic !== isFollowing && !loading) {
    setOptimistic(isFollowing);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={clsx(
        "rounded-lg px-5 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-300 disabled:opacity-60 disabled:cursor-not-allowed",
        optimistic
          ? "border border-brand-300 bg-white text-brand-700 hover:bg-brand-50"
          : "bg-brand-600 text-white hover:bg-brand-700"
      )}
    >
      {loading ? "…" : optimistic ? "Following" : "Follow"}
    </button>
  );
}
