"use client";

import { use, useCallback, useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/types";
import Spinner from "@/components/ui/Spinner";
import ProfileHeader from "@/components/profile/ProfileHeader";
import UserVideoGrid from "@/components/profile/UserVideoGrid";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProfilePage({ params }: PageProps) {
  const { id } = use(params);
  const { user: currentUser } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwnProfile = currentUser?._id === id;

  const fetchProfile = useCallback(async () => {
    try {
      const [userRes, followersRes, followingRes] = await Promise.all([
        api.get(`/users/${id}`),
        api.get(`/users/${id}/followers`),
        api.get(`/users/${id}/following`),
      ]);

      setUser(userRes.data.data ?? null);
      const followers = followersRes.data.data ?? [];
      setFollowersCount(followersRes.data.results ?? followers.length);
      const following = followingRes.data.data ?? [];
      setFollowingCount(followingRes.data.results ?? following.length);

      // Check if current user is in the followers list
      if (currentUser) {
        const isInList = followers.some(
          (f: { followerId: string | { _id: string } }) => {
            const fid = typeof f.followerId === "string" ? f.followerId : f.followerId?._id;
            return fid === currentUser._id;
          }
        );
        setIsFollowing(isInList);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id, currentUser]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  function handleToggleFollow() {
    // Refresh counts after follow/unfollow completes
    fetchProfile();
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (notFound || !user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">User not found</h1>
        <p className="mt-2 text-gray-600">The profile you&apos;re looking for doesn&apos;t exist.</p>
        <a
          href="/"
          className="mt-4 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Go Home
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <ProfileHeader
        user={user}
        followersCount={followersCount}
        followingCount={followingCount}
        isFollowing={isFollowing}
        onToggleFollow={handleToggleFollow}
        isOwnProfile={isOwnProfile}
      />

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Videos</h2>
        <UserVideoGrid userId={id} />
      </div>
    </div>
  );
}
