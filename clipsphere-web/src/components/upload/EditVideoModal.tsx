"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/services/api";
import type { Video } from "@/types";
import VideoForm from "./VideoForm";
import Toast from "@/components/ui/Toast";

interface EditVideoModalProps {
  video: Video;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (video: Video) => void;
}

export default function EditVideoModal({
  video,
  isOpen,
  onClose,
  onUpdated,
}: EditVideoModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  async function handleSubmit(data: {
    title: string;
    description: string;
    status: string;
  }) {
    setIsSubmitting(true);
    try {
      const res = await api.patch(`/videos/${video._id}`, {
        title: data.title,
        description: data.description,
      });
      const updated: Video = {
        ...video,
        title: data.title,
        description: data.description,
      };
      setToast({ message: "Video updated!", type: "success" });
      setTimeout(() => {
        onUpdated(updated);
        onClose();
      }, 600);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ?? "Failed to update video";
      setToast({ message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-strong font-display">Edit Video</h2>
          <button
            onClick={onClose}
            className="text-text-faint transition hover:text-text-muted"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <VideoForm
          mode="edit"
          initialValues={{
            title: video.title,
            description: video.description ?? "",
            status: video.status,
          }}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
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
