import { useCallback, useEffect, useState } from 'react';
import { loadMemos, saveMemos } from '../lib/storage';

function newId() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useMemos() {
  const [memos, setMemos] = useState(loadMemos);

  useEffect(() => {
    saveMemos(memos);
  }, [memos]);

  const addMemo = useCallback(({ text, location, source }) => {
    const now = Date.now();
    const memo = {
      id: newId(),
      text,
      location,
      source,
      createdAt: now,
      updatedAt: now,
    };
    setMemos((prev) => [memo, ...prev]);
    return memo;
  }, []);

  const updateMemo = useCallback((id, changes) => {
    setMemos((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...changes, updatedAt: Date.now() } : m)),
    );
  }, []);

  const deleteMemo = useCallback((id) => {
    setMemos((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return { memos, addMemo, updateMemo, deleteMemo };
}
