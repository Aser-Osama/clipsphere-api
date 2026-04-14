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
        "fixed bottom-4 right-4 z-50 rounded-lg px-4 py-3 text-white shadow-lg transition-opacity duration-300",
        { "bg-green-600": type === "success", "bg-red-600": type === "error", "bg-brand-600": type === "info", "opacity-0": !visible, "opacity-100": visible }
      )}
      role="alert"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{message}</span>
        <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="ml-2 text-white/80 hover:text-white">✕</button>
      </div>
    </div>
  );
}
