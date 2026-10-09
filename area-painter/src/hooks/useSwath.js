import { useEffect, useRef, useState } from 'react';
import { computeSwathAsync } from '../lib/swathClient';

/**
 * Painted area of the recording in progress, recomputed in the worker as fixes arrive.
 * Only one computation runs at a time; the latest track is picked up when it finishes.
 * Returns { areaM2, polygons } or null until the first result.
 */
export function useLiveSwath(active) {
  const [result, setResult] = useState(null);
  const latest = useRef(active);
  const busy = useRef(false);

  useEffect(() => {
    latest.current = active;
    function run() {
      const rec = latest.current;
      if (busy.current || !rec) return;
      busy.current = true;
      computeSwathAsync(rec.segments, rec.widthCm / 100)
        .then((r) => setResult({ startedAt: rec.startedAt, segments: rec.segments, ...r }))
        .catch(() => {})
        .finally(() => {
          busy.current = false;
          if (latest.current && latest.current.segments !== rec.segments) run();
        });
    }
    run();
  }, [active]);

  return result && active && result.startedAt === active.startedAt ? result : null;
}

// Saved recordings never change shape, so their polygons are computed once per session.
const savedCache = new Map();
const savedPending = new Set();

function cacheKey(rec) {
  return `${rec.id}:${rec.widthCm}`;
}

export function primeSwath(rec, result) {
  savedCache.set(cacheKey(rec), result);
}

/** Polygons for saved recordings: { [id]: { areaM2, polygons } }, filled in as they are computed. */
export function useSavedSwaths(recordings) {
  const [, setVersion] = useState(0);

  useEffect(() => {
    for (const rec of recordings) {
      const key = cacheKey(rec);
      if (savedCache.has(key) || savedPending.has(key)) continue;
      savedPending.add(key);
      computeSwathAsync(rec.segments, rec.widthCm / 100)
        .then((r) => {
          savedCache.set(key, r);
          setVersion((v) => v + 1);
        })
        .catch(() => {})
        .finally(() => savedPending.delete(key));
    }
  }, [recordings]);

  const out = {};
  for (const rec of recordings) {
    const r = savedCache.get(cacheKey(rec));
    if (r) out[rec.id] = r;
  }
  return out;
}
