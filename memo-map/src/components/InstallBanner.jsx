import { useInstallPrompt } from '../hooks/useInstallPrompt';

/** The iOS Share symbol: a box with an arrow pointing up. */
function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="inline h-4 w-4 align-[-2px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12M8 7l4-4 4 4" />
      <path d="M8 11H6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-2" />
    </svg>
  );
}

export default function InstallBanner() {
  const { mode, install, dismiss } = useInstallPrompt();
  if (!mode) return null;

  return (
    <div className="mt-3 flex items-center gap-3 rounded-2xl bg-indigo-50 p-3 text-sm text-indigo-900">
      <img src="apple-touch-icon.png" alt="" className="h-10 w-10 shrink-0 rounded-xl" />
      <p className="min-w-0 flex-1">
        {mode === 'prompt' ? (
          'Install Memo Map for quick access from your home screen. It also works offline.'
        ) : (
          <>
            Install Memo Map: tap <b>Share</b> <ShareIcon />, then <b>Add to Home Screen</b>.
          </>
        )}
      </p>
      <div className="flex shrink-0 flex-col items-end gap-1">
        {mode === 'prompt' && (
          <button onClick={install} className="rounded-lg bg-indigo-600 px-3 py-1.5 font-semibold text-white">
            Install
          </button>
        )}
        <button onClick={dismiss} className="px-1 text-xs text-indigo-700">
          Not now
        </button>
      </div>
    </div>
  );
}
