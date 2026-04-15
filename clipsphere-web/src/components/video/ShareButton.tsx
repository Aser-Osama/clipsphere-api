"use client";

import { useCallback, useState } from "react";
import clsx from "clsx";

interface ShareButtonProps {
  videoId: string;
  title?: string;
}

export default function ShareButton({ videoId, title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const share = useCallback(async () => {
    const url = `${window.location.origin}/video/${videoId}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: title ?? "Check out this video", url });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [videoId, title]);

  return (
    <button
      type="button"
      onClick={share}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all",
        copied
          ? "bg-success/15 text-success"
          : "bg-surface-2 text-text-muted hover:bg-surface-3 hover:text-text"
      )}
    >
      {copied ? (
        <>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
            />
          </svg>
          Share
        </>
      )}
    </button>
  );
}
