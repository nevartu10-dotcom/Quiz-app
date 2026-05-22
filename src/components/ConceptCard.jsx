import StarRating from './StarRating';

export default function ConceptCard({ concept, avgRating, totalResponses, navigate }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Color accent bar */}
      <div
        className="h-1.5 w-full"
        style={{ backgroundColor: concept.color }}
      />

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <span
            className="text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: concept.color + '18',
              color: concept.color,
            }}
          >
            {concept.category}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
          {concept.title}
        </h3>

        <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1">
          {concept.description}
        </p>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2">
            {avgRating !== null ? (
              <>
                <StarRating value={Math.round(avgRating)} readOnly size="sm" />
                <span className="text-xs text-slate-500">
                  {avgRating.toFixed(1)} ({totalResponses})
                </span>
              </>
            ) : (
              <span className="text-xs text-slate-400">No ratings yet</span>
            )}
          </div>

          <button
            onClick={() => navigate({ name: 'detail', conceptId: concept.id })}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
          >
            Explore <span className="text-base">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
