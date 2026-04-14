"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import type { Review } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import ReviewCard from "./ReviewCard";
import Spinner from "@/components/ui/Spinner";

interface ReviewListProps {
  videoId: string;
  refreshKey: number;
  optimisticReview?: Review | null;
  onReviewChanged?: () => void;
}

export default function ReviewList({ videoId, refreshKey, optimisticReview, onReviewChanged }: ReviewListProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cleared, setCleared] = useState(false);

  // When refreshKey changes, reset to page 1 and mark optimistic review as cleared
  useEffect(() => {
    setPage(1);
    if (optimisticReview) setCleared(true);
  }, [refreshKey]);

  // Reset cleared flag when optimisticReview changes to a new value
  useEffect(() => {
    if (optimisticReview) setCleared(false);
  }, [optimisticReview]);

  useEffect(() => {
    let cancelled = false;

    const fetchReviews = async () => {
      if (page === 1) setLoading(true);
      try {
        const { data } = await api.get(`/videos/${videoId}/reviews?page=${page}&limit=5`);
        if (!cancelled) {
          if (page === 1) {
            setReviews(data.data?.reviews ?? []);
          } else {
            setReviews((prev) => [...prev, ...(data.data?.reviews ?? [])]);
          }
          setTotalPages(data.data?.totalPages ?? 1);
          setUnavailable(false);
        }
      } catch {
        if (!cancelled) {
          if (page === 1) setReviews([]);
          setUnavailable(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchReviews();
    return () => {
      cancelled = true;
    };
  }, [videoId, refreshKey, page]);

  const handleReviewUpdated = (updated: Review) => {
    setReviews((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
    onReviewChanged?.();
  };

  const handleReviewDeleted = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    onReviewChanged?.();
  };

  const showOptimistic = optimisticReview && !cleared;
  const displayedReviews = showOptimistic
    ? [optimisticReview, ...reviews.filter((r) => r._id !== optimisticReview._id)]
    : reviews;

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (unavailable) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
        <p className="text-sm text-gray-500">
          Reviews will appear here once available.
        </p>
      </div>
    );
  }

  if (displayedReviews.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
        <p className="text-sm text-gray-500">
          No reviews yet. Be the first to review!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayedReviews.map((review) => (
        <ReviewCard
          key={review._id}
          review={review}
          currentUserId={user?._id}
          onUpdated={handleReviewUpdated}
          onDeleted={handleReviewDeleted}
        />
      ))}
      {page < totalPages && (
        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Load more
        </button>
      )}
    </div>
  );
}
