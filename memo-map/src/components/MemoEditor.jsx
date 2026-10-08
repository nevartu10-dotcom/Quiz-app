import { useCallback, useState } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { formatCoords } from '../lib/geo';

/**
 * Bottom sheet for creating or editing a memo. Text can be typed or dictated.
 * `location` is the point the memo will be pinned to.
 */
export default function MemoEditor({ memo, location, onSave, onCancel, onDelete }) {
  const [text, setText] = useState(memo?.text ?? '');
  const [usedSpeech, setUsedSpeech] = useState(memo?.source === 'speech');

  const appendTranscript = useCallback((chunk) => {
    if (!chunk) return;
    setUsedSpeech(true);
    setText((prev) => (prev && !/\s$/.test(prev) ? `${prev} ${chunk}` : prev + chunk));
  }, []);

  const speech = useSpeechRecognition({ onFinal: appendTranscript });
  const trimmed = text.trim();

  function handleSave(e) {
    e.preventDefault();
    if (!trimmed) return;
    speech.stop();
    onSave({ text: trimmed, source: usedSpeech ? 'speech' : 'text' });
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-slate-900/40" onClick={onCancel}>
      <form
        onSubmit={handleSave}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-t-3xl bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl"
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">{memo ? 'Edit memo' : 'New memo'}</h2>
          <span className="text-xs text-slate-500">📍 {formatCoords(location)}</span>
        </div>

        <div className="relative">
          <textarea
            autoFocus={!speech.supported}
            value={speech.interim ? `${text}${text && !/\s$/.test(text) ? ' ' : ''}${speech.interim}` : text}
            onChange={(e) => setText(e.target.value)}
            readOnly={speech.listening}
            rows={5}
            placeholder={speech.supported ? 'Type your memo or tap the mic to speak…' : 'Type your memo…'}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-3 pr-14 text-base text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
          {speech.supported && (
            <button
              type="button"
              onClick={speech.listening ? speech.stop : speech.start}
              aria-label={speech.listening ? 'Stop dictation' : 'Start dictation'}
              className={`absolute right-2 bottom-3 flex h-11 w-11 items-center justify-center rounded-full text-xl text-white shadow-md transition ${
                speech.listening ? 'animate-pulse bg-rose-500' : 'bg-indigo-600 active:bg-indigo-700'
              }`}
            >
              {speech.listening ? '■' : '🎤'}
            </button>
          )}
        </div>

        <p className="mt-2 min-h-5 text-xs text-slate-500">
          {speech.error
            ? <span className="text-rose-600">{speech.error}</span>
            : speech.listening
              ? 'Listening… tap ■ when you are done.'
              : !speech.supported && 'Voice input is not supported in this browser.'}
        </p>

        <div className="mt-3 flex gap-2">
          {memo && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(memo.id)}
              className="rounded-xl px-4 py-3 font-medium text-rose-600 active:bg-rose-50"
            >
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={onCancel}
            className="ml-auto rounded-xl px-4 py-3 font-medium text-slate-600 active:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!trimmed}
            className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white disabled:opacity-40 active:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
