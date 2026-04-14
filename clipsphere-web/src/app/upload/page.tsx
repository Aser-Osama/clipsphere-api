"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import VideoForm from "@/components/upload/VideoForm";
import Toast from "@/components/ui/Toast";

export default function UploadPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  async function handleCreate(data: {
    title: string;
    description: string;
    status: string;
    videoURL?: string;
    duration?: number;
  }) {
    setIsSubmitting(true);
    try {
      const res = await api.post("/videos", {
        title: data.title,
        description: data.description,
        videoURL: data.videoURL,
        duration: data.duration,
      });
      const video = res.data.data?.video ?? res.data.data ?? res.data;
      setToast({ message: "Video created successfully!", type: "success" });
      setTimeout(() => router.push(`/video/${video._id}`), 1200);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ?? "Failed to create video";
      setToast({ message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-160px)] items-start justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-2xl border border-brand-100 bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-2xl font-bold text-brand-900">
          Upload Video
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          Share a new video with the ClipSphere community. File upload will be
          available in Plan B&nbsp;— for now, only metadata is saved.
        </p>

        <VideoForm
          mode="create"
          onSubmit={handleCreate}
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
