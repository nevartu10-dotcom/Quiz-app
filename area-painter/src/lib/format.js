export function formatArea(m2) {
  if (m2 < 10) return `${m2.toFixed(1)} m²`;
  if (m2 < 10000) return `${Math.round(m2).toLocaleString()} m²`;
  return `${(m2 / 10000).toFixed(2)} ha`;
}

export function formatDuration(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mmss = `${String(m).padStart(h ? 2 : 1, '0')}:${String(s).padStart(2, '0')}`;
  return h ? `${h}:${mmss}` : mmss;
}

export function formatDistance(m) {
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1000).toFixed(m < 10000 ? 2 : 1)} km`;
}

export function formatWidth(cm) {
  return cm >= 100 ? `${+(cm / 100).toFixed(2)} m` : `${cm} cm`;
}

/** Area covered per hour, e.g. "0.42 ha/h". */
export function formatRate(m2, ms) {
  if (ms < 60000 || m2 <= 0) return '–';
  const perHour = m2 / (ms / 3600000);
  return perHour < 10000 ? `${Math.round(perHour).toLocaleString()} m²/h` : `${(perHour / 10000).toFixed(2)} ha/h`;
}

export function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

export function recordingTitle(rec) {
  return rec.name?.trim() || formatDate(rec.startedAt);
}
