"use client";

interface HealthWidgetProps {
  health: {
    uptime: number;
    memoryUsage: {
      rss: number;
      heapUsed: number;
      heapTotal: number;
    };
    dbStatus: string;
    environment?: string;
  };
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  return parts.join(" ");
}

function formatBytes(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

export default function HealthWidget({ health }: HealthWidgetProps) {
  const heapPercent =
    health.memoryUsage.heapTotal > 0
      ? (health.memoryUsage.heapUsed / health.memoryUsage.heapTotal) * 100
      : 0;

  const dbConnected = health.dbStatus === "connected";

  return (
    <div className="rounded-xl border border-brand-100 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-brand-900">System Health</h3>

      <dl className="mt-4 space-y-4">
        {/* Uptime */}
        <div>
          <dt className="text-xs font-medium text-brand-500 uppercase tracking-wide">Uptime</dt>
          <dd className="mt-1 text-2xl font-bold text-brand-800">{formatUptime(health.uptime)}</dd>
        </div>

        {/* Heap Memory */}
        <div>
          <dt className="text-xs font-medium text-brand-500 uppercase tracking-wide">Heap Memory</dt>
          <dd className="mt-1">
            <div className="flex items-center justify-between text-sm text-brand-700">
              <span>{formatBytes(health.memoryUsage.heapUsed)} / {formatBytes(health.memoryUsage.heapTotal)}</span>
              <span className="font-medium">{heapPercent.toFixed(0)}%</span>
            </div>
            <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-brand-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-500"
                style={{ width: `${Math.min(heapPercent, 100)}%` }}
              />
            </div>
          </dd>
        </div>

        {/* RSS */}
        <div>
          <dt className="text-xs font-medium text-brand-500 uppercase tracking-wide">RSS Memory</dt>
          <dd className="mt-1 text-sm font-medium text-brand-800">{formatBytes(health.memoryUsage.rss)}</dd>
        </div>

        {/* DB Status */}
        <div>
          <dt className="text-xs font-medium text-brand-500 uppercase tracking-wide">Database</dt>
          <dd className="mt-1 flex items-center gap-2 text-sm font-medium">
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${dbConnected ? "bg-green-500" : "bg-red-500"}`} />
            <span className={dbConnected ? "text-green-700" : "text-red-700"}>
              {health.dbStatus}
            </span>
          </dd>
        </div>

        {/* Environment */}
        <div>
          <dt className="text-xs font-medium text-brand-500 uppercase tracking-wide">Environment</dt>
          <dd className="mt-1">
            <span
              className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
                (health.environment ?? 'development') === "production"
                  ? "bg-brand-100 text-brand-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {health.environment ?? 'unknown'}
            </span>
          </dd>
        </div>
      </dl>
    </div>
  );
}
