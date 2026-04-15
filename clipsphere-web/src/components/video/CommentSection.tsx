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
      <h2 className="text-lg font-semibold text-text-strong font-display">Reviews</h2>

      {isAuthenticated ? (
        <ReviewForm
          videoId={videoId}
          onReviewAdded={(review: Review) => {
            setOptimisticReview(review);
            setRefreshKey((k) => k + 1);
          }}
        />
      ) : (
        <div className="rounded-lg border border-dashed border-border-accent bg-brand-500/5 p-4 text-center">
          <p className="text-sm text-text-muted">
            <a href="/login" className="font-medium underline text-brand-400 hover:text-brand-300">
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
