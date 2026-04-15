import clsx from "clsx";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      className={clsx(
        "animate-spin rounded-full border-2 border-surface-3 border-t-brand-500",
        { "h-4 w-4": size === "sm", "h-8 w-8": size === "md", "h-12 w-12": size === "lg" },
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}
