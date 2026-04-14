"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import type { Video } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import VideoPlayer from "@/components/video/VideoPlayer";
import LikeButton from "@/components/video/LikeButton";
import ShareButton from "@/components/video/ShareButton";
import CommentSection from "@/components/video/CommentSection";
import StarRating from "@/components/video/StarRating";
import Spinner from "@/components/ui/Spinner";
import EditVideoModal from "@/components/upload/EditVideoModal";
import DeleteConfirmModal from "@/components/upload/DeleteConfirmModal";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function VideoDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [stub, setStub] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const isOwnerOrAdmin =
    user?._id === video?.owner?._id || user?.role === "admin";

  useEffect(() => {
    let cancelled = false;

    const fetchVideo = async () => {
      try {
        const { data } = await api.get(`/videos/${id}`);
        if (!cancelled) {
          setVideo(data.data ?? null);
          setStub(false);
        }
      } catch {
        if (!cancelled) {
          setVideo(null);
          setStub(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchVideo();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left column: Player + Metadata */}
        <div className="space-y-4 lg:col-span-2">
          <VideoPlayer
            url={video?.videoURL ?? ""}
            title={video?.title ?? "Video"}
          />

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <LikeButton videoId={id} initialLikeCount={video?.likeCount ?? 0} />
            <ShareButton videoId={id} title={video?.title} />
          </div>

          {/* Owner / Admin actions */}
          {isOwnerOrAdmin && video && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEdit(true)}
                className="inline-flex items-center gap-1.5 rounded-md bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </button>
              <button
                onClick={() => setShowDelete(true)}
                className="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete
              </button>
            </div>
          )}

          {/* Metadata */}
          {stub ? (
            <div className="rounded-lg border border-dashed border-brand-200 bg-brand-50 p-6">
              <h1 className="text-xl font-bold text-brand-900">
                Video #{id}
              </h1>
              <p className="mt-2 text-sm text-brand-700">
                Video details will be available soon. The video detail endpoint
                is not yet deployed.
              </p>
            </div>
          ) : video ? (
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {video.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span>{video.viewsCount.toLocaleString()} views</span>
                <span>
                  {new Date(video.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                {video.averageRating != null && video.averageRating > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <StarRating
                      value={Math.round(video.averageRating)}
                      readonly
                      size="sm"
                    />
                    <span>({video.reviewCount ?? 0})</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                  {video.owner.username?.charAt(0).toUpperCase() ?? "?"}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {video.owner.username}
                </span>
              </div>

              {video.description && (
                <p className="text-sm leading-relaxed text-gray-700">
                  {video.description}
                </p>
              )}
            </div>
          ) : null}
        </div>

        {/* Right column: Reviews */}
        <div className="lg:col-span-1">
          <CommentSection videoId={id} />
        </div>
      </div>

      {/* Modals */}
      {video && (
        <>
          <EditVideoModal
            video={video}
            isOpen={showEdit}
            onClose={() => setShowEdit(false)}
            onUpdated={(updated) => {
              setVideo(updated);
              setShowEdit(false);
            }}
          />
          <DeleteConfirmModal
            video={video}
            isOpen={showDelete}
            onClose={() => setShowDelete(false)}
            onDeleted={() => router.push("/")}
          />
        </>
      )}
    </div>
  );
}
