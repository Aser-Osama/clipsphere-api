"use client";

import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import api from "@/services/api";
import type { User } from "@/types";
import Spinner from "@/components/ui/Spinner";
import Toast from "@/components/ui/Toast";
import NotificationToggles from "@/components/profile/NotificationToggles";

type Prefs = User["notificationPreferences"];

export default function SettingsPage() {
  const { user, isLoading, refreshUser } = useAuth();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [prefsSaving, setPrefsSaving] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Pre-fill form when user loads
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setBio(user.bio ?? "");
      setPrefs(user.notificationPreferences);
    }
  }, [user]);

  async function handleProfileSubmit(e: FormEvent) {
    e.preventDefault();
    setProfileSaving(true);

    try {
      await api.patch("/users/updateMe", { username, bio });
      await refreshUser();
      setToast({ message: "Profile updated!", type: "success" });
    } catch {
      setToast({ message: "Failed to update profile.", type: "error" });
    } finally {
      setProfileSaving(false);
    }
  }

  async function handlePrefsSave() {
    if (!prefs) return;
    setPrefsSaving(true);

    try {
      await api.patch("/users/preferences", { notificationPreferences: prefs });
      await refreshUser();
      setToast({ message: "Preferences saved!", type: "success" });
    } catch {
      setToast({ message: "Failed to save preferences.", type: "error" });
    } finally {
      setPrefsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Settings</h1>

      {/* Profile Section */}
      <section className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Edit Profile</h2>

        <form onSubmit={handleProfileSubmit} className="space-y-5">
          {/* Avatar stub */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Avatar</label>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-200 text-xl font-bold text-brand-800">
                {user?.username?.slice(0, 2).toUpperCase() ?? "?"}
              </div>
              <div>
                <input type="file" accept="image/*" disabled className="text-sm text-gray-400" />
                <p className="mt-1 text-xs text-gray-500">Avatar upload coming soon</p>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="bio" className="mb-1 block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              id="bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none"
              placeholder="Tell people about yourself…"
            />
          </div>

          <button
            type="submit"
            disabled={profileSaving}
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 focus:ring-2 focus:ring-brand-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {profileSaving ? "Saving…" : "Save Profile"}
          </button>
        </form>
      </section>

      {/* Notification Preferences */}
      <section className="mt-6 rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Notification Preferences</h2>

        {prefs && <NotificationToggles preferences={prefs} onChange={setPrefs} />}

        <div className="mt-5">
          <button
            type="button"
            onClick={handlePrefsSave}
            disabled={prefsSaving}
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 focus:ring-2 focus:ring-brand-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {prefsSaving ? "Saving…" : "Save Preferences"}
          </button>
        </div>
      </section>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
