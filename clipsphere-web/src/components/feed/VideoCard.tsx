import Link from "next/link";
import type { Video } from "@/types";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-xs text-yellow-500" aria-label={`${rating.toFixed(1)} stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} className="h-3.5 w-3.5" viewBox="0 0 20 20" fill={i < Math.round(rating) ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
    </span>
  );
}

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  // Deterministic gradient from video id
  const hue = video._id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

  return (
    <Link
      href={`/video/${video._id}`}
      className="group block overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-md"
    >
      {/* Thumbnail placeholder */}
      <div
        className="relative aspect-video"
        style={{ background: `linear-gradient(135deg, hsl(${hue},70%,65%), hsl(${(hue + 40) % 360},60%,50%))` }}
      >
        <span className="absolute bottom-1.5 right-1.5 rounded bg-black/75 px-1.5 py-0.5 text-xs font-medium text-white">
          {formatDuration(video.duration)}
        </span>
      </div>

      {/* Info */}
      <div className="p-3 space-y-1">
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-brand-600">
          {video.title}
        </h3>

        <p className="text-xs text-gray-500">{video.owner.username}</p>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>{formatCount(video.viewsCount)} views</span>
          {video.likeCount != null && <span>{formatCount(video.likeCount)} likes</span>}
          {video.averageRating != null && video.averageRating > 0 && (
            <StarRating rating={video.averageRating} />
          )}
        </div>
      </div>
    </Link>
  );
}
