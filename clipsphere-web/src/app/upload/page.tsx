"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { extractApiMessage } from "@/utils/extractApiMessage";
import Toast from "@/components/ui/Toast";
import Spinner from "@/components/ui/Spinner";

const ACCEPTED_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const ACCEPT_STRING = "video/mp4,video/webm,video/quicktime";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("public");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileError, setFileError] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError("");
    const selected = e.target.files?.[0] ?? null;
    if (!selected) {
      setFile(null);
      return;
    }
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setFileError(
        `Invalid file type "${selected.type || "unknown"}". Please select an MP4, WebM, or QuickTime video.`
      );
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setFile(selected);
    // Auto-fill title from filename if title is empty
    if (!title) {
      setTitle(selected.name.replace(/\.[^.]+$/, ""));
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      const syntheticEvent = {
        target: { files: [dropped] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(syntheticEvent);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFileError("");

    if (!file) {
      setFileError("Please select a video file.");
      return;
    }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError("Invalid file type. Please select an MP4, WebM, or QuickTime video.");
      return;
    }
    if (!title.trim()) return;

    setIsSubmitting(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("video", file);
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("status", status);

      const res = await api.post("/videos/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) =>
          setProgress(Math.round((e.loaded! * 100) / (e.total ?? 1))),
      });

      const video = res.data.data?.video ?? res.data.data ?? res.data;
      setToast({ message: "Video uploaded successfully!", type: "success" });
      setTimeout(() => router.push(`/video/${video._id}`), 1200);
    } catch (err: unknown) {
      const message = extractApiMessage(err);
      setToast({ message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Loading state while checking auth
  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Don't render the form if not authenticated (redirect is in-flight)
  if (!user) return null;

  return (
    <div className="flex min-h-[calc(100vh-160px)] items-start justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-2xl border border-brand-100 bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-2xl font-bold text-brand-900">
          Upload Video
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          Share a new video with the ClipSphere community.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ── File Drop Zone ── */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Video File <span className="text-red-500">*</span>
            </label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-brand-200 bg-brand-50/40 px-6 py-10 transition hover:border-brand-400 hover:bg-brand-50"
            >
              <svg
                className="mb-3 h-10 w-10 text-brand-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                />
              </svg>
              {file ? (
                <div className="text-center">
                  <p className="text-sm font-medium text-brand-700">
                    {file.name}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {formatBytes(file.size)}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">
                    Drag &amp; drop your video here, or{" "}
                    <span className="text-brand-600 underline">browse</span>
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    MP4, WebM, or QuickTime — max 5 minutes
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPT_STRING}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {fileError && (
              <p className="mt-1.5 text-sm text-red-600">{fileError}</p>
            )}
          </div>

          {/* ── Title ── */}
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
              required
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your video a title"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>

          {/* ── Description ── */}
          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              maxLength={2000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell viewers about your video (optional)"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>

          {/* ── Status ── */}
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
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          {/* ── Progress Bar ── */}
          {isSubmitting && (
            <div>
              <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
                <span>Uploading…</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={isSubmitting || !file || !title.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="border-white/30 border-t-white" />
                Uploading…
              </>
            ) : (
              "Upload Video"
            )}
          </button>
        </form>
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
