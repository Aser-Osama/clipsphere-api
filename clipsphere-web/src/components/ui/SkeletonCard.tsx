import clsx from "clsx";

interface SkeletonCardProps {
  className?: string;
}

export default function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={clsx("animate-pulse rounded-lg bg-surface border border-border", className)}>
      <div className="aspect-video rounded-t-lg bg-surface-3" />
      <div className="p-3 space-y-2">
        <div className="h-4 w-3/4 rounded bg-surface-3" />
        <div className="h-3 w-1/2 rounded bg-surface-3" />
      </div>
    </div>
  );
}
