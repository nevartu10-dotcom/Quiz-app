import { useState } from 'react';
import Sheet from './Sheet';
import { formatArea, formatDate, formatDistance, formatDuration, formatRate, formatWidth } from '../lib/format';

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="text-[11px] tracking-wide text-slate-500 uppercase">{label}</div>
      <div className="text-lg font-semibold text-slate-900 tabular-nums">{value}</div>
    </div>
  );
}

/**
 * Result of a recording. `summary` is one of:
 *  { status: 'calculating' } | { status: 'empty', durationMs } | { status: 'done', recording, isNew }
 */
export default function SummarySheet({ summary, onClose, onRename, onDelete, onShowOnMap }) {
  const rec = summary.recording;
  const [name, setName] = useState(rec?.name ?? '');

  if (summary.status === 'calculating') {
    return (
      <Sheet onClose={() => {}}>
        <p className="py-6 text-center text-slate-600">Calculating painted area…</p>
      </Sheet>
    );
  }

  if (summary.status === 'empty') {
    return (
      <Sheet onClose={onClose}>
        <h2 className="text-lg font-bold text-slate-900">Nothing painted</h2>
        <p className="mt-2 text-sm text-slate-600">
          No movement was recorded in {formatDuration(summary.durationMs)}. You need a GPS signal and to move at least a
          few metres. Nothing was saved.
        </p>
        <button onClick={onClose} className="mt-5 w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white">
          OK
        </button>
      </Sheet>
    );
  }

  const durationMs = rec.endedAt - rec.startedAt;

  function close() {
    if (name.trim() !== (rec.name ?? '')) onRename(rec.id, name.trim());
    onClose();
  }

  return (
    <Sheet onClose={close}>
      <p className="text-xs text-slate-500">{summary.isNew ? 'Recording saved' : formatDate(rec.startedAt)}</p>
      <div className="mt-1 text-center">
        <div className="text-[11px] tracking-wide text-slate-500 uppercase">Painted area</div>
        <div className="text-5xl font-bold text-emerald-700 tabular-nums">{formatArea(rec.areaM2)}</div>
        <div className="mt-1 text-lg font-semibold text-slate-700 tabular-nums">⏱ {formatDuration(durationMs)}</div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Stat label="Width" value={formatWidth(rec.widthCm)} />
        <Stat label="Distance" value={formatDistance(rec.distanceM)} />
        <Stat label="Rate" value={formatRate(rec.areaM2, durationMs)} />
      </div>

      <label className="mt-4 block text-sm font-medium text-slate-700">
        Name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={formatDate(rec.startedAt)}
          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-base outline-none focus:border-emerald-600"
        />
      </label>

      <div className="mt-5 flex gap-3">
        <button
          onClick={() => {
            if (window.confirm('Delete this recording?')) onDelete(rec.id);
          }}
          className="rounded-xl bg-red-50 px-4 py-3 font-semibold text-red-700"
        >
          Delete
        </button>
        {!summary.isNew && (
          <button
            onClick={() => {
              close();
              onShowOnMap(rec);
            }}
            className="flex-1 rounded-xl bg-slate-100 py-3 font-semibold text-slate-700"
          >
            Show on map
          </button>
        )}
        <button onClick={close} className="flex-1 rounded-xl bg-emerald-600 py-3 font-semibold text-white">
          Done
        </button>
      </div>
    </Sheet>
  );
}
