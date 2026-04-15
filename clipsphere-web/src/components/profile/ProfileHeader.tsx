"use client";

import { useState } from "react";
import FollowButton from "./FollowButton";
import type { User } from "@/types";

interface ProfileHeaderProps {
  user: User;
  avatarUrl?: string | null;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  onToggleFollow: () => void;
  isOwnProfile: boolean;
}

function getInitials(username: string) {
  return username.slice(0, 2).toUpperCase();
}

export default function ProfileHeader({
  user,
  avatarUrl,
  followersCount,
  followingCount,
  isFollowing,
  onToggleFollow,
  isOwnProfile,
}: ProfileHeaderProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-surface">
      {/* Banner */}
      <div className="h-32 rounded-t-2xl bg-gradient-to-r from-brand-700 via-brand-500 to-gold sm:h-40" />

      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="-mt-14 flex items-end gap-4 sm:-mt-16">
          {avatarUrl && !imgError ? (
            <img
              src={avatarUrl}
              alt={user.username}
              onError={() => setImgError(true)}
              className="h-24 w-24 shrink-0 rounded-full border-4 border-surface object-cover ring-2 ring-brand-500/30 sm:h-28 sm:w-28"
            />
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-surface bg-brand-500/20 text-2xl font-bold text-brand-400 ring-2 ring-brand-500/30 sm:h-28 sm:w-28 sm:text-3xl">
              {getInitials(user.username)}
            </div>
          )}
        </div>

        {/* Info + Follow */}
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-xl font-bold text-text-strong font-display sm:text-2xl">
                {user.username}
              </h1>
              {user.role === "admin" && (
                <span className="shrink-0 rounded-full bg-brand-500/15 px-2.5 py-0.5 text-xs font-semibold text-brand-400">
                  Admin
                </span>
              )}
            </div>
            {user.bio && (
              <p className="mt-1 text-sm text-text-muted">{user.bio}</p>
            )}
          </div>

          {!isOwnProfile && (
            <FollowButton
              userId={user._id}
              isFollowing={isFollowing}
              onToggle={onToggleFollow}
            />
          )}

          {isOwnProfile && (
            <a
              href="/settings"
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-text transition hover:bg-surface-3"
            >
              Edit Profile
            </a>
          )}
        </div>

        {/* Stats */}
        <div className="mt-4 flex gap-6 border-t border-border-subtle pt-4">
          <div className="text-center">
            <span className="block text-lg font-bold text-text-strong">{followersCount}</span>
            <span className="text-xs text-text-muted">Followers</span>
          </div>
          <div className="text-center">
            <span className="block text-lg font-bold text-text-strong">{followingCount}</span>
            <span className="text-xs text-text-muted">Following</span>
          </div>
        </div>
      </div>
    </div>
  );
}
