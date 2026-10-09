import { useState } from 'react';
import Sheet from './Sheet';
import { formatWidth } from '../lib/format';

const PRESETS = [30, 50, 100, 150, 200, 300, 600, 1200];
export const MIN_WIDTH_CM = 1;
export const MAX_WIDTH_CM = 5000;

export default function WidthSheet({ widthCm, onSave, onCancel }) {
  const [value, setValue] = useState(String(widthCm));
  const cm = Number(value);
  const valid = Number.isFinite(cm) && cm >= MIN_WIDTH_CM && cm <= MAX_WIDTH_CM;

  function submit(e) {
    e.preventDefault();
    if (valid) onSave(Math.round(cm));
  }

  return (
    <Sheet onClose={onCancel}>
      <form onSubmit={submit}>
        <h2 className="text-lg font-bold text-slate-900">Tool width</h2>
        <p className="mt-1 text-sm text-slate-500">The working width of your tool. The painted strip is this wide.</p>

        <label className="mt-4 flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 focus-within:border-emerald-600">
          <input
            type="number"
            inputMode="numeric"
            min={MIN_WIDTH_CM}
            max={MAX_WIDTH_CM}
            step="1"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            className="min-w-0 flex-1 text-2xl font-semibold text-slate-900 outline-none"
          />
          <span className="text-lg text-slate-500">cm</span>
        </label>
        {!valid && (
          <p className="mt-1 text-sm text-red-600">
            Enter a width from {MIN_WIDTH_CM} to {MAX_WIDTH_CM} cm.
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setValue(String(p))}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                Number(value) === p ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {formatWidth(p)}
            </button>
          ))}
        </div>

        <div className="mt-5 flex gap-3">
          <button type="button" onClick={onCancel} className="flex-1 rounded-xl bg-slate-100 py-3 font-semibold text-slate-700">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!valid}
            className="flex-1 rounded-xl bg-emerald-600 py-3 font-semibold text-white disabled:bg-slate-300"
          >
            Save
          </button>
        </div>
      </form>
    </Sheet>
  );
}
