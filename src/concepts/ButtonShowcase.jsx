import { useState } from 'react';

function Toast({ message }) {
  return (
    <div className="fixed bottom-6 right-6 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-bounce z-50">
      {message}
    </div>
  );
}

export default function ButtonShowcase() {
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }

  function handleLoading() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Action completed!');
    }, 1500);
  }

  return (
    <div className="space-y-8 p-2">
      {toast && <Toast message={toast} />}

      {/* Style Variants */}
      <section>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Style Variants</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => showToast('Primary clicked!')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 active:scale-95 transition-all duration-150 shadow-sm"
          >
            Primary
          </button>
          <button
            onClick={() => showToast('Secondary clicked!')}
            className="px-4 py-2 bg-white text-slate-700 rounded-lg font-medium border border-slate-300 hover:bg-slate-50 hover:border-slate-400 active:scale-95 transition-all duration-150 shadow-sm"
          >
            Secondary
          </button>
          <button
            onClick={() => showToast('Ghost clicked!')}
            className="px-4 py-2 bg-transparent text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 active:scale-95 transition-all duration-150"
          >
            Ghost
          </button>
          <button
            onClick={() => showToast('Danger! Clicked!')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 active:scale-95 transition-all duration-150 shadow-sm"
          >
            Danger
          </button>
          <button
            onClick={() => showToast('Success clicked!')}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 active:scale-95 transition-all duration-150 shadow-sm"
          >
            Success
          </button>
          <button
            disabled
            className="px-4 py-2 bg-slate-100 text-slate-400 rounded-lg font-medium cursor-not-allowed"
          >
            Disabled
          </button>
        </div>
      </section>

      {/* Loading State */}
      <section>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Loading State</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleLoading}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 active:scale-95 transition-all duration-150 shadow-sm flex items-center gap-2 disabled:opacity-80"
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              'Click to Load'
            )}
          </button>
        </div>
      </section>

      {/* Icon Buttons */}
      <section>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Icon + Text</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => showToast('Saved!')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 active:scale-95 transition-all duration-150 shadow-sm flex items-center gap-2"
          >
            <span>💾</span> Save
          </button>
          <button
            onClick={() => showToast('Deleted!')}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium border border-red-200 hover:bg-red-100 active:scale-95 transition-all duration-150 flex items-center gap-2"
          >
            <span>🗑️</span> Delete
          </button>
          <button
            onClick={() => showToast('Shared!')}
            className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-medium border border-emerald-200 hover:bg-emerald-100 active:scale-95 transition-all duration-150 flex items-center gap-2"
          >
            <span>📤</span> Share
          </button>
          <button
            onClick={() => showToast('Edited!')}
            className="px-4 py-2 bg-amber-50 text-amber-700 rounded-lg font-medium border border-amber-200 hover:bg-amber-100 active:scale-95 transition-all duration-150 flex items-center gap-2"
          >
            <span>✏️</span> Edit
          </button>
          <button
            onClick={() => showToast('Liked!')}
            className="p-2.5 bg-pink-50 text-pink-600 rounded-lg border border-pink-200 hover:bg-pink-100 active:scale-95 transition-all duration-150"
          >
            <span className="text-lg">❤️</span>
          </button>
          <button
            onClick={() => showToast('Settings!')}
            className="p-2.5 bg-slate-100 text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-200 active:scale-95 transition-all duration-150"
          >
            <span className="text-lg">⚙️</span>
          </button>
        </div>
      </section>

      {/* Size Variants */}
      <section>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Size Variants</h3>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => showToast('Small clicked!')}
            className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-xs font-medium hover:bg-indigo-700 active:scale-95 transition-all duration-150"
          >
            Small
          </button>
          <button
            onClick={() => showToast('Medium clicked!')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 active:scale-95 transition-all duration-150"
          >
            Medium
          </button>
          <button
            onClick={() => showToast('Large clicked!')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-base font-semibold hover:bg-indigo-700 active:scale-95 transition-all duration-150"
          >
            Large
          </button>
          <button
            onClick={() => showToast('Full-width clicked!')}
            className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 active:scale-95 transition-all duration-150"
          >
            Full Width
          </button>
        </div>
      </section>

      {/* Outlined Variants */}
      <section>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Outlined Variants</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Indigo', cls: 'border-indigo-400 text-indigo-700 hover:bg-indigo-50' },
            { label: 'Purple', cls: 'border-purple-400 text-purple-700 hover:bg-purple-50' },
            { label: 'Cyan', cls: 'border-cyan-400 text-cyan-700 hover:bg-cyan-50' },
            { label: 'Amber', cls: 'border-amber-400 text-amber-700 hover:bg-amber-50' },
            { label: 'Emerald', cls: 'border-emerald-400 text-emerald-700 hover:bg-emerald-50' },
          ].map(({ label, cls }) => (
            <button
              key={label}
              onClick={() => showToast(`${label} clicked!`)}
              className={`px-4 py-2 border-2 rounded-lg font-medium transition-all duration-150 active:scale-95 ${cls}`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
