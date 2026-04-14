"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-brand-900 text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            ClipSphere
          </Link>

          <div className="hidden md:flex md:items-center md:gap-4">
            <Link href="/" className="hover:text-brand-300 transition-colors">Home</Link>
            {isAuthenticated && (
              <>
                <Link href="/upload" className="hover:text-brand-300 transition-colors">Upload</Link>
                <Link href="/settings" className="hover:text-brand-300 transition-colors">Settings</Link>
              </>
            )}
            {user?.role === "admin" && (
              <Link href="/admin" className="hover:text-brand-300 transition-colors">Admin</Link>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link href={`/profile/${user?._id}`} className="hover:text-brand-300 transition-colors">
                  {user?.username}
                </Link>
                <button onClick={logout} className="rounded bg-brand-600 px-3 py-1 text-sm hover:bg-brand-500 transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="rounded bg-brand-600 px-3 py-1 text-sm hover:bg-brand-500 transition-colors">Login</Link>
                <Link href="/register" className="rounded border border-brand-400 px-3 py-1 text-sm hover:bg-brand-800 transition-colors">Register</Link>
              </div>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
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
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block hover:text-brand-300" onClick={() => setMobileOpen(false)}>Home</Link>
            {isAuthenticated && (
              <>
                <Link href="/upload" className="block hover:text-brand-300" onClick={() => setMobileOpen(false)}>Upload</Link>
                <Link href="/settings" className="block hover:text-brand-300" onClick={() => setMobileOpen(false)}>Settings</Link>
              </>
            )}
            {user?.role === "admin" && (
              <Link href="/admin" className="block hover:text-brand-300" onClick={() => setMobileOpen(false)}>Admin</Link>
            )}
            {isAuthenticated ? (
              <>
                <Link href={`/profile/${user?._id}`} className="block hover:text-brand-300" onClick={() => setMobileOpen(false)}>{user?.username}</Link>
                <button onClick={logout} className="block text-left hover:text-brand-300">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block hover:text-brand-300" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link href="/register" className="block hover:text-brand-300" onClick={() => setMobileOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
