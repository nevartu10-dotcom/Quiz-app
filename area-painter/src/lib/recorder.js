import { createStore, useStore } from './store';
import { KEYS, load, save } from './storage';
import { addFix as addFixToTrack } from './track';

/**
 * The recording in progress, or null:
 * { startedAt, widthCm, segments, endedAt? }
 * It is saved on every change so a reload or crash doesn't lose it.
 */
const store = createStore(load(KEYS.active, null));

function set(next) {
  store.set(next);
  save(KEYS.active, next);
}

export function startRecording(widthCm) {
  set({ startedAt: Date.now(), widthCm, segments: [] });
}

/** Feed every GPS fix here; it's only used while recording. */
export function addFix(fix) {
  const active = store.get();
  if (!active || active.endedAt || fix.time < active.startedAt) return;
  const segments = addFixToTrack(active.segments, fix);
  if (segments !== active.segments) set({ ...active, segments });
}

/** Stops taking fixes. The recording is kept until `clearRecording()` so it can be finalised safely. */
export function stopRecording() {
  const active = store.get();
  if (!active || active.endedAt) return active;
  const stopped = { ...active, endedAt: Date.now() };
  set(stopped);
  return stopped;
}

export function clearRecording() {
  set(null);
}

export function useActiveRecording() {
  return useStore(store);
}
