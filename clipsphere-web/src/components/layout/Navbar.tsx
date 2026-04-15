"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getAvatarUrl } from "@/utils/avatarUrl";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user?._id) {
      getAvatarUrl(user._id).then(setAvatarUrl);
    }
  }, [user?._id]);

  return (
    <nav className="glass sticky top-0 z-50 border-b border-border-subtle">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold tracking-tight text-brand-500">
            ClipSphere
          </Link>

          <div className="hidden md:flex md:items-center md:gap-4">
            <Link href="/" className="text-text hover:text-brand-400 transition-colors">Home</Link>
            {isAuthenticated && (
              <>
                <Link href="/upload" className="text-text hover:text-brand-400 transition-colors">Upload</Link>
                <Link href="/settings" className="text-text hover:text-brand-400 transition-colors">Settings</Link>
              </>
            )}
            {user?.role === "admin" && (
              <Link href="/admin" className="text-text hover:text-brand-400 transition-colors">Admin</Link>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link href={`/profile/${user?._id}`} className="flex items-center gap-2 text-text hover:text-brand-400 transition-colors">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user?.username ?? ""}
                      className="h-7 w-7 rounded-full object-cover ring-2 ring-brand-500/30"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500/20 text-brand-400 text-xs font-bold ring-2 ring-brand-500/30">
                      {user?.username?.charAt(0).toUpperCase() ?? "?"}
                    </span>
                  )}
                  {user?.username}
                </Link>
                <button onClick={logout} className="rounded bg-surface-3 px-3 py-1 text-sm text-text hover:bg-surface-2 transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="rounded bg-brand-500 px-3 py-1 text-sm text-white hover:bg-brand-400 transition-colors">Login</Link>
                <Link href="/register" className="rounded border border-brand-500/30 px-3 py-1 text-sm text-brand-400 hover:bg-brand-500/10 transition-colors">Register</Link>
              </div>
            )}
          </div>

          <button className="md:hidden p-2 text-text-strong" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2 bg-surface-2 rounded-b-lg border-t border-border px-2 pt-2">
            <Link href="/" className="block text-text hover:text-brand-400 transition-colors" onClick={() => setMobileOpen(false)}>Home</Link>
            {isAuthenticated && (
              <>
                <Link href="/upload" className="block text-text hover:text-brand-400 transition-colors" onClick={() => setMobileOpen(false)}>Upload</Link>
                <Link href="/settings" className="block text-text hover:text-brand-400 transition-colors" onClick={() => setMobileOpen(false)}>Settings</Link>
              </>
            )}
            {user?.role === "admin" && (
              <Link href="/admin" className="block text-text hover:text-brand-400 transition-colors" onClick={() => setMobileOpen(false)}>Admin</Link>
            )}
            {isAuthenticated ? (
              <>
                <Link href={`/profile/${user?._id}`} className="block text-text hover:text-brand-400 transition-colors" onClick={() => setMobileOpen(false)}>{user?.username}</Link>
                <button onClick={logout} className="block text-left text-text hover:text-brand-400 transition-colors">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-text hover:text-brand-400 transition-colors" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link href="/register" className="block text-text hover:text-brand-400 transition-colors" onClick={() => setMobileOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
