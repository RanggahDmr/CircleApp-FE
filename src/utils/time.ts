export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const target = typeof date === "string" ? new Date(date) : date;

  const diffMs = now.getTime() - target.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;

  // Kalau lebih dari seminggu → tampilkan tanggal singkat
  return target.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}
