"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { AxiosError } from "axios";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getRedirectTarget = () => {
    if (typeof window === "undefined") {
      return "/";
    }

    const from = new URLSearchParams(window.location.search).get("from");
    return from?.startsWith("/") ? from : "/";
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push(getRedirectTarget());
    }
  }, [authLoading, isAuthenticated, router]);

  function validate(): string | null {
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format";
    if (!password) return "Password is required";
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      router.push(getRedirectTarget());
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || "Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (authLoading || isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 bg-gradient-to-br from-brand-500/5 via-transparent to-violet-500/5">
      <div className="glass glow-accent w-full max-w-md rounded-2xl p-8 animate-fade-in-up">
        <h1 className="mb-6 text-center font-display text-2xl font-bold text-text-strong">
          Sign in to ClipSphere
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-text-muted">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm text-text-strong placeholder-text-faint focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-text-muted">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm text-text-strong placeholder-text-faint focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-sm text-error">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-400 focus:ring-2 focus:ring-brand-500/30 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-brand-400 hover:text-brand-300">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
