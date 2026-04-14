"use client";

import FollowButton from "./FollowButton";
import type { User } from "@/types";

interface ProfileHeaderProps {
  user: User;
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
  followersCount,
  followingCount,
  isFollowing,
  onToggleFollow,
  isOwnProfile,
}: ProfileHeaderProps) {
  return (
    <div className="rounded-2xl border border-brand-100 bg-white shadow-sm">
      {/* Banner */}
      <div className="h-32 rounded-t-2xl bg-gradient-to-r from-brand-500 to-brand-700 sm:h-40" />

      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="-mt-14 flex items-end gap-4 sm:-mt-16">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white bg-brand-200 text-2xl font-bold text-brand-800 shadow sm:h-28 sm:w-28 sm:text-3xl">
            {getInitials(user.username)}
          </div>
        </div>

        {/* Info + Follow */}
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-xl font-bold text-gray-900 sm:text-2xl">
                {user.username}
              </h1>
              {user.role === "admin" && (
                <span className="shrink-0 rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                  Admin
                </span>
              )}
            </div>
            {user.bio && (
              <p className="mt-1 text-sm text-gray-600">{user.bio}</p>
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
              className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Edit Profile
            </a>
          )}
        </div>

        {/* Stats */}
        <div className="mt-4 flex gap-6 border-t border-gray-100 pt-4">
          <div className="text-center">
            <span className="block text-lg font-bold text-gray-900">{followersCount}</span>
            <span className="text-xs text-gray-500">Followers</span>
          </div>
          <div className="text-center">
            <span className="block text-lg font-bold text-gray-900">{followingCount}</span>
            <span className="text-xs text-gray-500">Following</span>
          </div>
        </div>
      </div>
    </div>
  );
}
