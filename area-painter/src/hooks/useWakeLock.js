import { useEffect } from 'react';

/** Keeps the screen on while `enabled`. Browsers stop GPS updates for hidden pages. */
export function useWakeLock(enabled) {
  useEffect(() => {
    if (!enabled || !navigator.wakeLock) return;
    let lock = null;
    let cancelled = false;

    async function acquire() {
      if (document.visibilityState !== 'visible') return;
      try {
        const l = await navigator.wakeLock.request('screen');
        if (cancelled) l.release();
        else lock = l;
      } catch {
        // Denied (e.g. battery saver). Recording still works while the screen stays on.
      }
    }

    // The lock is dropped whenever the page is hidden, so take it again on return.
    const onVisible = () => acquire();
    document.addEventListener('visibilitychange', onVisible);
    acquire();
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisible);
      lock?.release().catch(() => {});
    };
  }, [enabled]);
}
