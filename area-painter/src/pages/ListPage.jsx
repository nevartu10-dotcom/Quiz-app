import InstallBanner from '../components/InstallBanner';
import { formatArea, formatDate, formatDistance, formatDuration, formatWidth, recordingTitle } from '../lib/format';

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-[11px] tracking-wide text-slate-500 uppercase">{label}</div>
      <div className="font-semibold text-slate-900 tabular-nums">{value}</div>
    </div>
  );
}

export default function ListPage({ recordings, storageFull, onShowOnMap, onShowDetails }) {
  return (
    <div className="h-full overflow-y-auto bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-3 backdrop-blur">
        <h1 className="text-xl font-bold text-slate-900">Recordings</h1>
        <InstallBanner />
      </header>

      {storageFull && (
        <p className="mx-4 mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-800">
          Storage is full, so the latest changes are not saved. Delete old recordings to free space.
        </p>
      )}

      {recordings.length === 0 ? (
        <div className="px-6 py-16 text-center text-slate-500">
          <div className="mb-2 text-4xl">🖌️</div>
          No recordings yet. Set your tool width on the map, press the green button and start moving.
        </div>
      ) : (
        <ul className="flex flex-col gap-3 p-4">
          {recordings.map((rec) => (
            <li key={rec.id} className="rounded-2xl bg-white p-4 shadow-sm">
              <button onClick={() => onShowDetails(rec)} className="block w-full text-left">
                <div className="flex items-baseline gap-2">
                  <h2 className="min-w-0 flex-1 truncate font-semibold text-slate-900">{recordingTitle(rec)}</h2>
                  <span className="text-xl font-bold text-emerald-700 tabular-nums">{formatArea(rec.areaM2)}</span>
                </div>
                {rec.name?.trim() && <p className="text-xs text-slate-500">{formatDate(rec.startedAt)}</p>}
                <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                  <Stat label="Time" value={formatDuration(rec.endedAt - rec.startedAt)} />
                  <Stat label="Width" value={formatWidth(rec.widthCm)} />
                  <Stat label="Distance" value={formatDistance(rec.distanceM)} />
                </div>
              </button>
              <button onClick={() => onShowOnMap(rec)} className="mt-3 text-sm font-semibold text-emerald-700">
                Show on map →
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
