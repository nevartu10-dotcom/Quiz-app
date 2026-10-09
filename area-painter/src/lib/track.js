const EARTH_RADIUS_M = 6371008.8;
const DEG = Math.PI / 180;

/** Fixes less accurate than this (metres, 68% radius) are ignored. */
export const MAX_ACCURACY_M = 25;
/** Movement smaller than this is treated as standing still. */
export const MIN_STEP_M = 1;
/** Faster than this between two fixes is a GPS glitch, not movement (≈ 180 km/h). */
export const MAX_SPEED_MPS = 50;
/** A longer pause in fixes starts a new segment instead of painting a straight line across the gap. */
export const MAX_GAP_MS = 15000;

/** Great-circle distance in metres between two [lat, lng, ...] points. */
export function distanceMeters(a, b) {
  const dLat = (b[0] - a[0]) * DEG;
  const dLng = (b[1] - a[1]) * DEG;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * DEG) * Math.cos(b[0] * DEG) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

export function trackLength(segments) {
  let total = 0;
  for (const seg of segments) {
    for (let i = 1; i < seg.length; i++) total += distanceMeters(seg[i - 1], seg[i]);
  }
  return total;
}

export function pointCount(segments) {
  return segments.reduce((n, seg) => n + seg.length, 0);
}

/**
 * Adds a GPS fix { lat, lng, accuracy, time } to a track (array of segments of
 * [lat, lng, time] points). Returns the new track, or the same one if the fix was rejected.
 */
export function addFix(segments, fix) {
  if (!(fix.accuracy <= MAX_ACCURACY_M)) return segments;
  const point = [round6(fix.lat), round6(fix.lng), fix.time];
  const lastSeg = segments[segments.length - 1];
  const last = lastSeg?.[lastSeg.length - 1];
  if (!last) return [[point]];

  const dt = fix.time - last[2];
  if (dt <= 0) return segments;
  if (dt > MAX_GAP_MS) return [...segments, [point]];

  const d = distanceMeters(last, point);
  if (d < MIN_STEP_M) return segments;
  if (d / (dt / 1000) > MAX_SPEED_MPS) return segments;
  return [...segments.slice(0, -1), [...lastSeg, point]];
}

// ~11 cm precision, far finer than GPS, and keeps saved recordings small.
function round6(x) {
  return Math.round(x * 1e6) / 1e6;
}
