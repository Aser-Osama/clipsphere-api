"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/services/api";
import type { Video } from "@/types";
import Spinner from "@/components/ui/Spinner";
import Toast from "@/components/ui/Toast";

interface DeleteConfirmModalProps {
  video: Pick<Video, "_id" | "title">;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeleteConfirmModal({
  video,
  isOpen,
  onClose,
  onDeleted,
}: DeleteConfirmModalProps) {
  const [confirmation, setConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const titleMatch = confirmation === video.title;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      setConfirmation("");
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  async function handleDelete() {
    if (!titleMatch) return;
    setIsDeleting(true);
    try {
      await api.delete(`/videos/${video._id}`);
      setToast({ message: "Video deleted", type: "success" });
      setTimeout(() => {
        onDeleted();
        onClose();
      }, 600);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ?? "Failed to delete video";
      setToast({ message, type: "error" });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-error font-display">Delete Video</h2>
        <p className="mt-2 text-sm text-text-muted">
          This action is <strong>irreversible</strong>. The video{" "}
          <span className="font-semibold text-text-strong">
            &ldquo;{video.title}&rdquo;
          </span>{" "}
          and all associated data will be permanently removed.
        </p>

        <div className="mt-4">
          <label
            htmlFor="confirm-title"
            className="mb-1 block text-sm font-medium text-text-muted"
          >
            Type the video title to confirm:
          </label>
          <input
            id="confirm-title"
            type="text"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm text-text-strong placeholder-text-faint focus:border-error focus:ring-2 focus:ring-error/20 focus:outline-none"
            placeholder={video.title}
            autoComplete="off"
          />
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg bg-surface-2 px-4 py-2.5 text-sm font-medium text-text-muted transition hover:bg-surface-3"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={!titleMatch || isDeleting}
            className="flex-1 rounded-lg bg-error px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-error/90 focus:ring-2 focus:ring-error/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Spinner size="sm" className="border-white/30 border-t-white" />
                Deleting…
              </span>
            ) : (
              "Delete Permanently"
            )}
          </button>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
