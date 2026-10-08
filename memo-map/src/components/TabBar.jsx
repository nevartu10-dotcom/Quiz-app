const TABS = [
  { id: 'map', label: 'Map', icon: '🗺️' },
  { id: 'list', label: 'Memos', icon: '📝' },
];

export default function TabBar({ active, onChange, count }) {
  return (
    <nav className="flex border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)]">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium ${
            active === tab.id ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <span className="text-xl leading-none">{tab.icon}</span>
          {tab.label}
          {tab.id === 'list' && count > 0 && ` (${count})`}
        </button>
      ))}
    </nav>
  );
}
