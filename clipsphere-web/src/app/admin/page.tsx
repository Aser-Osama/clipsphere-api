"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import api from "@/services/api";
import type { AxiosError } from "axios";
import Spinner from "@/components/ui/Spinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Toast from "@/components/ui/Toast";
import StatsCards from "@/components/admin/StatsCards";
import HealthWidget from "@/components/admin/HealthWidget";
import ModerationTable from "@/components/admin/ModerationTable";

interface StatsData {
  totalUsers: number;
  totalVideos: number;
  mostActiveUsers: Array<{ username: string; videoCount?: number }>;
}

interface HealthData {
  uptime: number;
  memoryUsage: { rss: number; heapUsed: number; heapTotal: number };
  dbStatus: string;
  environment?: string;
}

interface VideoItem {
  _id?: string;
  title?: string;
  owner?: string | { username: string };
  status?: string;
  averageRating?: number;
}

interface ModerationData {
  flaggedVideos: VideoItem[];
  lowRatedVideos: VideoItem[];
}

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<StatsData | null>(null);
  const [health, setHealth] = useState<HealthData | null>(null);
  const [moderation, setModeration] = useState<ModerationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" | "info" } | null>(null);

  // Client-side admin check
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      setToast({ message: "Admin access required", type: "error" });
      router.replace("/");
    }
  }, [user, authLoading, router]);

  const fetchHealth = useCallback(async () => {
    try {
      const { data } = await api.get("/admin/health");
      setHealth(data.data);
    } catch {
      // silent – health auto-refreshes
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, healthRes, modRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/health"),
        api.get("/admin/moderation"),
      ]);
      setStats(statsRes.data.data);
      setHealth(healthRes.data.data);
      setModeration(modRes.data.data);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message ?? "Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    if (!authLoading && user?.role === "admin") {
      fetchAll();
    }
  }, [authLoading, user, fetchAll]);

  // Auto-refresh health every 30s
  useEffect(() => {
    if (!authLoading && user?.role === "admin") {
      const id = setInterval(fetchHealth, 30_000);
      return () => clearInterval(id);
    }
  }, [authLoading, user, fetchHealth]);

  // While auth is resolving or user isn't admin, show spinner
  if (authLoading || !user || user.role !== "admin") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="text-3xl font-bold text-brand-900">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-brand-500">
        System overview and content moderation
      </p>

      {error && (
        <div className="mt-6">
          <ErrorMessage message={error} retry={fetchAll} />
        </div>
      )}

      {loading ? (
        <div className="mt-16 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          {stats && (
            <section className="mt-8">
              <StatsCards stats={stats} />
            </section>
          )}

          {/* Two-column: Health + Moderation */}
          <div className="mt-8 grid gap-6 lg:grid-cols-5">
            {health && (
              <div className="lg:col-span-2">
                <HealthWidget health={health} />
              </div>
            )}

            {moderation && (
              <div className="lg:col-span-3">
                <ModerationTable
                  flaggedVideos={moderation.flaggedVideos}
                  lowRatedVideos={moderation.lowRatedVideos}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
