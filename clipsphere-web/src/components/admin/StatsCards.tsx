"use client";

interface MostActiveUser {
  username: string;
  [key: string]: any;
}

interface StatsCardsProps {
  stats: {
    totalUsers: number;
    totalVideos: number;
    mostActiveUsers: MostActiveUser[];
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* Total Users */}
      <div className="rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <svg className="h-8 w-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </svg>
          <span className="text-sm font-medium opacity-90">Total Users</span>
        </div>
        <p className="mt-3 text-4xl font-bold">{stats.totalUsers.toLocaleString()}</p>
      </div>

      {/* Total Videos */}
      <div className="rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <svg className="h-8 w-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
          <span className="text-sm font-medium opacity-90">Total Videos</span>
        </div>
        <p className="mt-3 text-4xl font-bold">{stats.totalVideos.toLocaleString()}</p>
      </div>

      {/* Most Active Users */}
      <div className="rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 p-6 text-white shadow-lg sm:col-span-2 lg:col-span-1">
        <div className="flex items-center gap-3">
          <svg className="h-8 w-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 0 1-2.77.672 6.023 6.023 0 0 1-2.77-.672" />
          </svg>
          <span className="text-sm font-medium opacity-90">Most Active Users</span>
        </div>
        <ul className="mt-3 space-y-1.5">
          {stats.mostActiveUsers.length === 0 && (
            <li className="text-sm opacity-75">No data yet</li>
          )}
          {stats.mostActiveUsers.slice(0, 5).map((u, i) => (
            <li key={u.username} className="flex items-center gap-2 text-sm">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                {i + 1}
              </span>
              <span className="font-medium">{u.username}</span>
              {u.videoCount != null && (
                <span className="ml-auto text-xs opacity-75">{u.videoCount} videos</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
