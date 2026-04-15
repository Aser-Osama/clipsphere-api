"use client";

import { useState } from "react";
import Link from "next/link";

interface VideoItem {
  _id?: string;
  title?: string;
  owner?: string | { username: string };
  status?: string;
  averageRating?: number;
}

interface ModerationTableProps {
  flaggedVideos: VideoItem[];
  lowRatedVideos: VideoItem[];
}

type Tab = "flagged" | "lowRated";

export default function ModerationTable({ flaggedVideos = [], lowRatedVideos = [] }: ModerationTableProps) {
  const [tab, setTab] = useState<Tab>("flagged");

  const videos = tab === "flagged" ? flaggedVideos : lowRatedVideos;

  return (
    <div className="rounded-xl border border-border bg-surface-2">
      {/* Tab Switcher */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setTab("flagged")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            tab === "flagged"
              ? "border-b-2 border-brand-500 text-brand-400 bg-brand-500/5"
              : "text-text-faint hover:text-text-muted"
          }`}
        >
          Flagged ({flaggedVideos.length})
        </button>
        <button
          onClick={() => setTab("lowRated")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            tab === "lowRated"
              ? "border-b-2 border-brand-500 text-brand-400 bg-brand-500/5"
              : "text-text-faint hover:text-text-muted"
          }`}
        >
          Low Rated ({lowRatedVideos.length})
        </button>
      </div>

      {/* Table */}
      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-text-faint">
          <svg className="mb-2 h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <p className="text-sm">
            {tab === "flagged" ? "No flagged videos" : "No low-rated videos"}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-text-faint">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Owner</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video: VideoItem, i: number) => (
                <tr
                  key={video._id ?? i}
                  className="border-b border-border-subtle even:bg-surface/50 hover:bg-surface-3/50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-text-strong max-w-[200px] truncate">
                    {video.title ?? "Untitled"}
                  </td>
                  <td className="px-4 py-3 text-text">
                    {typeof video.owner === "object" ? video.owner.username : video.owner ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        video.status === "flagged"
                          ? "bg-error/15 text-error"
                          : video.status === "public"
                            ? "bg-success/15 text-success"
                            : "bg-surface-3 text-text-muted"
                      }`}
                    >
                      {video.status ?? "unknown"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text">
                    {video.averageRating != null ? video.averageRating.toFixed(1) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/video/${video._id}`}
                      className="text-brand-400 hover:text-brand-300 font-medium text-xs hover:underline"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
