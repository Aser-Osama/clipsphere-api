"use client";

import { useState } from "react";
import api from "@/services/api";
import type { Review } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import StarRating from "./StarRating";
import Spinner from "@/components/ui/Spinner";

interface ReviewFormProps {
  videoId: string;
  onReviewAdded: (review: Review) => void;
}

export default function ReviewForm({ videoId, onReviewAdded }: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await api.post(`/videos/${videoId}/reviews`, {
        rating,
        ...(comment.trim() && { comment: comment.trim() }),
      });
      const createdReview: Review = data.data ?? {
        _id: `optimistic-${Date.now()}`,
        rating,
        ...(comment.trim() && { comment: comment.trim() }),
        user: { _id: user?._id ?? "", username: user?.username ?? "", avatarKey: user?.avatarKey },
        video: videoId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setRating(0);
      setComment("");
      onReviewAdded(createdReview);
    } catch (err: unknown) {
      const status =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { status?: number; data?: { message?: string } } })
              .response
          : undefined;
      if (status?.status === 409) {
        setError("You have already reviewed this video");
      } else {
        setError(status?.data?.message ?? "Failed to submit review");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Your Rating
        </label>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      <div>
        <label
          htmlFor="review-comment"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Comment (optional)
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Share your thoughts about this video..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading && <Spinner size="sm" />}
        Submit Review
      </button>
    </form>
  );
}
