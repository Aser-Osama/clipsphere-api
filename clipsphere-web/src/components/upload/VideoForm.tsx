"use client";

import { FormEvent, useState } from "react";
import Spinner from "@/components/ui/Spinner";

interface VideoFormProps {
  mode: "create" | "edit";
  initialValues?: { title: string; description: string; status: string };
  onSubmit: (data: {
    title: string;
    description: string;
    status: string;
    videoURL?: string;
    duration?: number;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export default function VideoForm({
  mode,
  initialValues,
  onSubmit,
  isSubmitting,
}: VideoFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [status, setStatus] = useState(initialValues?.status ?? "public");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    const payload: {
      title: string;
      description: string;
      status: string;
      videoURL?: string;
      duration?: number;
    } = { title: title.trim(), description: description.trim(), status };

    if (mode === "create") {
      payload.videoURL = "pending://upload";
      payload.duration = 0;
    }

    await onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none"
          placeholder="Give your video a title"
          maxLength={150}
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full resize-y rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none"
          placeholder="Tell viewers about your video"
          maxLength={2000}
        />
      </div>

      {/* Status */}
      <div>
        <label
          htmlFor="status"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Visibility
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>

      {/* File input — disabled for Plan A */}
      {mode === "create" && (
        <div className="relative">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Video File
          </label>
          <div className="relative rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-gray-100/80">
              <span className="rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700">
                File upload coming soon — Plan B will enable this
              </span>
            </div>
            <input type="file" accept="video/*" disabled className="hidden" />
            <p className="text-sm text-gray-400">
              Drag & drop or click to upload
            </p>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 focus:ring-2 focus:ring-brand-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <Spinner size="sm" className="border-white/30 border-t-white" />
            {mode === "create" ? "Creating…" : "Saving…"}
          </span>
        ) : mode === "create" ? (
          "Create Video (metadata only)"
        ) : (
          "Save Changes"
        )}
      </button>
    </form>
  );
}
