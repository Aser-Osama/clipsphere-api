"use client";

import type { User } from "@/types";

type Prefs = User["notificationPreferences"];

interface NotificationTogglesProps {
  preferences: Prefs;
  onChange: (prefs: Prefs) => void;
}

const CATEGORIES: { key: keyof Prefs["inApp"]; label: string }[] = [
  { key: "followers", label: "New followers" },
  { key: "comments", label: "Comments" },
  { key: "likes", label: "Likes" },
  { key: "tips", label: "Tips" },
];

const CHANNELS: { key: keyof Prefs; label: string }[] = [
  { key: "inApp", label: "In-App" },
  { key: "email", label: "Email" },
];

export default function NotificationToggles({ preferences, onChange }: NotificationTogglesProps) {
  function toggle(channel: keyof Prefs, category: keyof Prefs["inApp"]) {
    const updated: Prefs = {
      inApp: { ...preferences.inApp },
      email: { ...preferences.email },
    };
    updated[channel][category] = !updated[channel][category];
    onChange(updated);
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-3 pr-4 text-left font-medium text-gray-700">Category</th>
            {CHANNELS.map((ch) => (
              <th key={ch.key} className="px-4 py-3 text-center font-medium text-gray-700">
                {ch.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CATEGORIES.map((cat) => (
            <tr key={cat.key} className="border-b border-gray-100">
              <td className="py-3 pr-4 text-gray-800">{cat.label}</td>
              {CHANNELS.map((ch) => (
                <td key={ch.key} className="px-4 py-3 text-center">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={preferences[ch.key][cat.key]}
                    aria-label={`${cat.label} ${ch.label}`}
                    onClick={() => toggle(ch.key, cat.key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-300 ${
                      preferences[ch.key][cat.key] ? "bg-brand-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ${
                        preferences[ch.key][cat.key] ? "translate-x-5" : "translate-x-0.5"
                      } mt-0.5`}
                    />
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
