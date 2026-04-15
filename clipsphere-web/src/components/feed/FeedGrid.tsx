import { type RefCallback } from "react";
import type { Video } from "@/types";
import VideoCard from "./VideoCard";
import Spinner from "@/components/ui/Spinner";

interface FeedGridProps {
  videos: Video[];
  sentinelRef?: RefCallback<HTMLDivElement>;
  isLoadingMore?: boolean;
}

export default function FeedGrid({ videos, sentinelRef, isLoadingMore }: FeedGridProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((video, i) => (
          <div key={video._id} className={i < 8 ? `stagger-${i + 1}` : undefined}>
            <VideoCard video={video} />
          </div>
        ))}
      </div>
      {sentinelRef && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          {isLoadingMore && <Spinner size="md" />}
        </div>
      )}
    </>
  );
}
