"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { Review } from "@/types";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

interface CommentSectionProps {
  videoId: string;
}

export default function CommentSection({ videoId }: CommentSectionProps) {
  const { isAuthenticated } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [optimisticReview, setOptimisticReview] = useState<Review | null>(null);

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Reviews</h2>

      {isAuthenticated ? (
        <ReviewForm
          videoId={videoId}
          onReviewAdded={(review: Review) => {
            setOptimisticReview(review);
            setRefreshKey((k) => k + 1);
          }}
        />
      ) : (
        <div className="rounded-lg border border-dashed border-brand-200 bg-brand-50 p-4 text-center">
          <p className="text-sm text-brand-700">
            <a href="/login" className="font-medium underline hover:text-brand-900">
              Log in
            </a>{" "}
            to leave a review
          </p>
        </div>
      )}

      <ReviewList videoId={videoId} refreshKey={refreshKey} optimisticReview={optimisticReview} />
    </section>
  );
}
