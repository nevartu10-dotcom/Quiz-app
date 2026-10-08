const KEY = 'memo-map:memos';

export function loadMemos() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveMemos(memos) {
  try {
    localStorage.setItem(KEY, JSON.stringify(memos));
  } catch {
    // Storage full or unavailable (e.g. private mode) — keep in-memory state.
  }
}
