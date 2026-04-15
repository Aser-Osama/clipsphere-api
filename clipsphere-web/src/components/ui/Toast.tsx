"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type = "info", duration = 4000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={clsx(
        "glass fixed bottom-4 right-4 z-50 rounded-lg px-4 py-3 shadow-2xl border-l-4 text-text-strong transition-opacity duration-300",
        { "border-l-success": type === "success", "border-l-error": type === "error", "border-l-brand-500": type === "info", "opacity-0": !visible, "opacity-100": visible }
      )}
      role="alert"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{message}</span>
        <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="ml-2 text-text-faint hover:text-text-muted">✕</button>
      </div>
    </div>
  );
}
