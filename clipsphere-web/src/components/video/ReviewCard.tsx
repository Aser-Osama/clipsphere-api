"use client";

import { useState } from "react";
import type { Review } from "@/types";
import api from "@/services/api";
import { extractApiMessage } from "@/utils/extractApiMessage";
import StarRating from "./StarRating";

interface ReviewCardProps {
  review: Review;
  currentUserId?: string;
  onUpdated?: (review: Review) => void;
  onDeleted?: (reviewId: string) => void;
}

export default function ReviewCard({
  review,
  currentUserId,
  onUpdated,
  onDeleted,
}: ReviewCardProps) {
  const isOwner = currentUserId === review.user._id;
  const date = new Date(review.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const [editing, setEditing] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editComment, setEditComment] = useState(review.comment ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");

  const [displayRating, setDisplayRating] = useState(review.rating);
  const [displayComment, setDisplayComment] = useState(review.comment);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const { data } = await api.patch(`/api/v1/reviews/${review._id}`, {
        rating: editRating,
        comment: editComment,
      });
      const updated: Review =
        data.data ?? { ...review, rating: editRating, comment: editComment };
      setDisplayRating(updated.rating);
      setDisplayComment(updated.comment);
      setEditing(false);
      onUpdated?.(updated);
    } catch (err: unknown) {
      const status =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { status?: number } }).response?.status
          : undefined;
      if (status === 403) {
        setError("You can only edit your own reviews");
      } else if (status === 404) {
        setError("Review not found");
      } else {
        setError(extractApiMessage(err));
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      await api.delete(`/api/v1/reviews/${review._id}`);
      onDeleted?.(review._id);
    } catch (err: unknown) {
      const status =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { status?: number } }).response?.status
          : undefined;
      if (status === 403) {
        setError("You can only delete your own reviews");
      } else if (status === 404) {
        setError("Review not found");
      } else {
        setError(extractApiMessage(err));
      }
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditRating(displayRating);
    setEditComment(displayComment ?? "");
    setError("");
  };

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
        {!editing && <StarRating value={displayRating} readonly size="sm" />}
      </div>

      {editing ? (
        <div className="mt-3 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Rating
            </label>
            <StarRating value={editRating} onChange={setEditRating} size="sm" />
          </div>
          <textarea
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="Your review…"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={saving}
              className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        displayComment && (
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            {displayComment}
          </p>
        )
      )}

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      {isOwner && !editing && (
        <div className="mt-3 flex gap-2">
          {confirmDelete ? (
            <>
              <span className="text-xs text-gray-700">
                Delete this review?
              </span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Confirm"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmDelete(false);
                  setError("");
                }}
                disabled={deleting}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setEditing(true);
                  setEditRating(displayRating);
                  setEditComment(displayComment ?? "");
                  setError("");
                }}
                className="text-xs text-brand-600 hover:text-brand-700"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="text-xs text-red-600 hover:text-red-700"
              >
                Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
