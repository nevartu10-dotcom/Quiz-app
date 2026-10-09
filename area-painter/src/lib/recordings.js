import { createStore, useStore } from './store';
import { KEYS, load, save } from './storage';

function loadRecordings() {
  const list = load(KEYS.recordings, []);
  return Array.isArray(list) ? list : [];
}

const store = createStore({ list: loadRecordings(), storageFull: false });

function commit(list) {
  store.set({ list, storageFull: !save(KEYS.recordings, list) });
}

export function addRecording(rec) {
  commit([rec, ...store.get().list]);
}

export function updateRecording(id, changes) {
  commit(store.get().list.map((r) => (r.id === id ? { ...r, ...changes } : r)));
}

export function deleteRecording(id) {
  commit(store.get().list.filter((r) => r.id !== id));
}

/** { list, storageFull } — newest first. */
export function useRecordings() {
  return useStore(store);
}
