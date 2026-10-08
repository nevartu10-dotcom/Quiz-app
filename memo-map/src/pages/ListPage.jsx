import { useMemo, useState } from 'react';
import InstallBanner from '../components/InstallBanner';
import { distanceMeters, formatDate, formatDistance } from '../lib/geo';

export default function ListPage({ memos, position, onShowOnMap, onEdit }) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('recent');

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const withDistance = memos
      .filter((m) => !q || m.text.toLowerCase().includes(q))
      .map((m) => ({ ...m, distance: position ? distanceMeters(position, m.location) : null }));
    if (sort === 'nearby' && position) {
      withDistance.sort((a, b) => a.distance - b.distance);
    } else {
      withDistance.sort((a, b) => b.createdAt - a.createdAt);
    }
    return withDistance;
  }, [memos, position, query, sort]);

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
        <h1 className="text-2xl font-bold text-slate-900">Memos</h1>
        <InstallBanner />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search memos"
          className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-base outline-none focus:border-indigo-400"
        />
        <div className="mt-3 flex gap-2 text-sm">
          {[
            ['recent', 'Recent'],
            ['nearby', 'Nearby'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setSort(id)}
              disabled={id === 'nearby' && !position}
              className={`rounded-full px-3 py-1 font-medium disabled:opacity-40 ${
                sort === id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <ul className="flex-1 space-y-2 overflow-y-auto p-3">
        {items.length === 0 && (
          <li className="py-16 text-center text-slate-500">
            {memos.length === 0 ? 'No memos yet. Add one from the map.' : 'No memos match your search.'}
          </li>
        )}
        {items.map((memo) => (
          <li key={memo.id} className="rounded-2xl bg-white p-4 shadow-sm">
            <button onClick={() => onShowOnMap(memo)} className="block w-full text-left">
              <p className="line-clamp-3 whitespace-pre-wrap text-slate-900">{memo.text}</p>
              <p className="mt-2 flex flex-wrap gap-x-3 text-xs text-slate-500">
                <span>{memo.source === 'speech' ? '🎤 Voice' : '⌨️ Typed'}</span>
                <span>{formatDate(memo.createdAt)}</span>
                {memo.distance != null && <span>📍 {formatDistance(memo.distance)} away</span>}
              </p>
            </button>
            <div className="mt-3 flex gap-4 text-sm font-semibold">
              <button onClick={() => onShowOnMap(memo)} className="text-indigo-600">Show on map</button>
              <button onClick={() => onEdit(memo)} className="text-slate-600">Edit</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
