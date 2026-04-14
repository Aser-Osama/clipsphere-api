"use client";

import type { Review } from "@/types";
import StarRating from "./StarRating";

interface ReviewCardProps {
  review: Review;
  currentUserId?: string;
}

export default function ReviewCard({ review, currentUserId }: ReviewCardProps) {
  const isOwner = currentUserId === review.user._id;
  const date = new Date(review.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
            {review.user.username?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {review.user.username}
            </p>
            <p className="text-xs text-gray-500">{date}</p>
          </div>
        </div>
        <StarRating value={review.rating} readonly size="sm" />
      </div>

      {review.comment && (
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          {review.comment}
        </p>
      )}

      {isOwner && (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            disabled
            title="Coming soon"
            className="text-xs text-gray-400 cursor-not-allowed"
          >
            Edit
          </button>
          <button
            type="button"
            disabled
            title="Coming soon"
            className="text-xs text-gray-400 cursor-not-allowed"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
