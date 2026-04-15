"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import api from "@/services/api";
import type { User } from "@/types";
import Spinner from "@/components/ui/Spinner";
import Toast from "@/components/ui/Toast";
import NotificationToggles from "@/components/profile/NotificationToggles";
import { getAvatarUrl, invalidateAvatarCache } from "@/utils/avatarUrl";
import { extractApiMessage } from "@/utils/extractApiMessage";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

type Prefs = User["notificationPreferences"];

export default function SettingsPage() {
  const { user, isLoading, refreshUser } = useAuth();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [prefsSaving, setPrefsSaving] = useState(false);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Pre-fill form when user loads
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setBio(user.bio ?? "");
      setPrefs(user.notificationPreferences);
    }
  }, [user]);

  // Fetch current avatar on mount
  useEffect(() => {
    if (user?._id) {
      getAvatarUrl(user._id).then(setAvatarUrl);
    }
  }, [user?._id]);

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
      await api.patch("/users/preferences", prefs);
      await refreshUser();
      setToast({ message: "Preferences saved!", type: "success" });
    } catch {
      setToast({ message: "Failed to save preferences.", type: "error" });
    } finally {
      setPrefsSaving(false);
    }
  }

  function handleAvatarSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setToast({ message: "Please select a JPEG, PNG, or WebP image.", type: "error" });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setToast({ message: "Image must be smaller than 5 MB.", type: "error" });
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleAvatarUpload() {
    if (!avatarFile || !user) return;
    setAvatarSaving(true);

    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      await api.post("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      invalidateAvatarCache(user._id);
      const newUrl = await getAvatarUrl(user._id);
      setAvatarUrl(newUrl);
      setAvatarFile(null);
      setAvatarPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await refreshUser();
      setToast({ message: "Avatar updated!", type: "success" });
    } catch (err) {
      setToast({ message: extractApiMessage(err), type: "error" });
    } finally {
      setAvatarSaving(false);
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
      <h1 className="mb-8 text-2xl font-bold text-text-strong font-display">Settings</h1>

      {/* Profile Section */}
      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 text-lg font-semibold text-text-strong">Edit Profile</h2>

        <form onSubmit={handleProfileSubmit} className="space-y-5">
          {/* Avatar */}
          <div>
            <label className="mb-1 block text-sm font-medium text-text-muted">Avatar</label>
            <div className="flex items-center gap-4">
              {avatarPreview || avatarUrl ? (
                <img
                  src={avatarPreview ?? avatarUrl!}
                  alt="Avatar preview"
                  className="h-16 w-16 rounded-full object-cover border-2 border-border"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/20 text-xl font-bold text-brand-400">
                  {user?.username?.slice(0, 2).toUpperCase() ?? "?"}
                </div>
              )}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAvatarSelect}
                  className="block text-sm text-text-muted file:mr-4 file:rounded-lg file:border file:border-border file:bg-surface-2 file:px-4 file:py-2 file:text-sm file:font-medium file:text-text-strong hover:file:border-brand-500/40 hover:file:bg-surface-3"
                />
                {avatarFile && (
                  <button
                    type="button"
                    onClick={handleAvatarUpload}
                    disabled={avatarSaving}
                    className="mt-2 rounded-lg bg-brand-500 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-400 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {avatarSaving ? "Uploading…" : "Upload Avatar"}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-medium text-text-muted">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm text-text-strong focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="bio" className="mb-1 block text-sm font-medium text-text-muted">
              Bio
            </label>
            <textarea
              id="bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm text-text-strong placeholder-text-faint focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
              placeholder="Tell people about yourself…"
            />
          </div>

          <button
            type="submit"
            disabled={profileSaving}
            className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-400 focus:ring-2 focus:ring-brand-500/20 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {profileSaving ? "Saving…" : "Save Profile"}
          </button>
        </form>
      </section>

      {/* Notification Preferences */}
      <section className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 text-lg font-semibold text-text-strong">Notification Preferences</h2>

        {prefs && <NotificationToggles preferences={prefs} onChange={setPrefs} />}

        <div className="mt-5">
          <button
            type="button"
            onClick={handlePrefsSave}
            disabled={prefsSaving}
            className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-400 focus:ring-2 focus:ring-brand-500/20 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
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
