"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  url: string;
  title: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function VideoPlayer({ url, title }: VideoPlayerProps) {
  const isValidUrl = url && url.startsWith("http");

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  useEffect(() => {
    const onFsChange = () =>
      setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
    resetHideTimer();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const t = Number(e.target.value);
    v.currentTime = t;
    setCurrentTime(t);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const vol = Number(e.target.value);
    v.volume = vol;
    setVolume(vol);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const seekPercent = duration ? (currentTime / duration) * 100 : 0;
  const volumePercent = volume * 100;

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-black">
      {isValidUrl ? (
        <div
          ref={containerRef}
          className="group relative aspect-video"
          onMouseMove={resetHideTimer}
          onMouseLeave={() => setShowControls(false)}
        >
          {/* Video element */}
          <video
            ref={videoRef}
            src={url}
            className="h-full w-full object-contain"
            onClick={togglePlay}
            onTimeUpdate={() =>
              setCurrentTime(videoRef.current?.currentTime ?? 0)
            }
            onLoadedMetadata={() =>
              setDuration(videoRef.current?.duration ?? 0)
            }
            onEnded={() => setPlaying(false)}
          />

          {/* Duration badge — top-right */}
          {duration > 0 && (
            <span className="absolute right-2 top-2 rounded bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
              {formatTime(duration)}
            </span>
          )}

          {/* Controls overlay — bottom */}
          <div
            className={`absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-6 transition-opacity duration-300 ${
              showControls ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {/* Seek bar */}
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-text-faint accent-brand-500"
              style={{
                background: `linear-gradient(to right, var(--color-brand-500, #FF6B5B) ${seekPercent}%, var(--color-text-faint, #4A4640) ${seekPercent}%)`,
              }}
            />

            <div className="flex items-center gap-3">
              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                className="text-text-strong transition hover:text-brand-400"
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Time display */}
              <span className="min-w-[5rem] text-xs text-text-muted">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              <div className="flex-1" />

              {/* Volume */}
              <div className="flex items-center gap-1">
                <svg
                  className="h-4 w-4 text-text-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.536 8.464a5 5 0 010 7.072M12 6.253v11.494a.75.75 0 01-1.214.587L6.536 15H4.25A1.25 1.25 0 013 13.75v-3.5C3 9.56 3.56 9 4.25 9h2.286l4.25-3.334A.75.75 0 0112 6.253z"
                  />
                </svg>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={handleVolume}
                  className="h-1 w-16 cursor-pointer appearance-none rounded-full bg-text-faint accent-brand-500"
                  style={{
                    background: `linear-gradient(to right, var(--color-brand-500, #FF6B5B) ${volumePercent}%, var(--color-text-faint, #4A4640) ${volumePercent}%)`,
                  }}
                />
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-text-strong transition hover:text-brand-400"
                aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9L4 4m0 0v4m0-4h4m7 5l5-5m0 0v4m0-4h-4m-7 7l-5 5m0 0v-4m0 4h4m7-5l5 5m0 0v-4m0 4h-4" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-brand-600 to-brand-900">
          <div className="text-center text-white">
            <svg
              className="mx-auto mb-3 h-16 w-16 opacity-60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
            <p className="text-lg font-medium">Video player — coming soon</p>
            <p className="mt-1 text-sm text-white/70">{title}</p>
          </div>
        </div>
      )}
    </div>
  );
}
