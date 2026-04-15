"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
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
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stub, setStub] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Stream URL state
  const [presignedUrl, setPresignedUrl] = useState("");
  const [streamError, setStreamError] = useState(false);
  const [videoUnavailable, setVideoUnavailable] = useState(false);
  const retryRef = useRef(0);
  const playerWrapperRef = useRef<HTMLDivElement>(null);

  const isOwner = user?._id === video?.owner?._id;
  const canDelete = isOwner || user?.role === "admin";

  const fetchStreamUrl = useCallback(async (): Promise<string> => {
    const { data } = await api.get(`/videos/${id}/stream`);
    return data.data?.url ?? "";
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const { data } = await api.get(`/videos/${id}`);
        if (cancelled) return;
        setVideo(data.data?.video ?? null);
        setLikeCount(data.data?.likeCount ?? 0);
        setHasLiked(data.data?.hasLiked ?? false);
        setStub(false);

        // Fetch presigned stream URL
        try {
          const url = await fetchStreamUrl();
          if (!cancelled) {
            setPresignedUrl(url);
            setStreamError(false);
          }
        } catch {
          if (!cancelled) {
            setPresignedUrl("");
            setStreamError(true);
          }
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

    load();
    return () => {
      cancelled = true;
    };
  }, [id, fetchStreamUrl]);

  // Re-fetch presigned URL on <video> error (max 1 retry)
  useEffect(() => {
    const wrapper = playerWrapperRef.current;
    if (!wrapper || !presignedUrl) return;

    const videoEl = wrapper.querySelector("video");
    if (!videoEl) return;

    const handleError = async () => {
      if (retryRef.current < 1) {
        retryRef.current += 1;
        try {
          const url = await fetchStreamUrl();
          setPresignedUrl(url);
        } catch {
          setVideoUnavailable(true);
        }
      } else {
        setVideoUnavailable(true);
      }
    };

    videoEl.addEventListener("error", handleError);
    return () => videoEl.removeEventListener("error", handleError);
  }, [presignedUrl, fetchStreamUrl]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Left column: Player + Metadata */}
        <div className="space-y-4">
          {videoUnavailable ? (
            <div className="w-full overflow-hidden rounded-xl bg-black">
              <div className="flex aspect-video items-center justify-center">
                <p className="text-sm text-white/70">Video unavailable</p>
              </div>
            </div>
          ) : streamError && !presignedUrl ? (
            <div className="w-full overflow-hidden rounded-xl bg-black">
              <div className="flex aspect-video items-center justify-center">
                <div className="text-center text-white">
                  <svg
                    className="mx-auto mb-3 h-12 w-12 animate-pulse opacity-60"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                  <p className="text-sm text-white/70">Video processing…</p>
                </div>
              </div>
            </div>
          ) : (
            <div ref={playerWrapperRef}>
              <VideoPlayer
                url={presignedUrl}
                title={video?.title ?? "Video"}
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <LikeButton videoId={id} initialLikeCount={likeCount} initialLiked={hasLiked} />
            <ShareButton videoId={id} title={video?.title} />
          </div>

          {/* Owner / Admin actions */}
          {(isOwner || canDelete) && video && (
            <div className="flex items-center gap-2">
              {isOwner && (
                <button
                  onClick={() => setShowEdit(true)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-brand-500/10 px-3 py-1.5 text-sm font-medium text-brand-400 hover:bg-brand-500/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => setShowDelete(true)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-error/10 px-3 py-1.5 text-sm font-medium text-error hover:bg-error/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Delete
                </button>
              )}
            </div>
          )}

          {/* Metadata */}
          {stub ? (
            <div className="rounded-lg border border-dashed border-border bg-surface-2 p-6">
              <h1 className="text-xl font-bold text-text-strong font-display">
                Video #{id}
              </h1>
              <p className="mt-2 text-sm text-text-muted">
                Video details will be available soon. The video detail endpoint
                is not yet deployed.
              </p>
            </div>
          ) : video ? (
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-text-strong font-display">
                {video.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
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
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/20 text-sm font-semibold text-brand-400">
                  {video.owner.username?.charAt(0).toUpperCase() ?? "?"}
                </div>
                <span className="text-sm font-medium text-text-strong">
                  {video.owner.username}
                </span>
              </div>

              {video.description && (
                <p className="text-sm leading-relaxed text-text">
                  {video.description}
                </p>
              )}
            </div>
          ) : null}
        </div>

        {/* Reviews/Comments – below player at all breakpoints */}
        <div>
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
