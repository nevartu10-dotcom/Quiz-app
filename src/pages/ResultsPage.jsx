import { concepts } from '../data/concepts';
import StarRating from '../components/StarRating';

function RatingBar({ count, total, star }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-amber-400 w-3">{star}★</span>
      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-slate-500 w-6 text-right">{count}</span>
    </div>
  );
}

export default function ResultsPage({ navigate, feedback }) {
  const allFeedback = feedback.getAllFeedback();

  const totalResponses = Object.values(allFeedback).reduce(
    (sum, entries) => sum + entries.length,
    0
  );
  const conceptsRated = Object.keys(allFeedback).filter(
    (id) => allFeedback[id].length > 0
  ).length;

  const allRatings = Object.values(allFeedback).flat().map((e) => e.rating);
  const globalAvg =
    allRatings.length > 0
      ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length
      : null;

  const withFeedback = concepts.filter(
    (c) => allFeedback[c.id] && allFeedback[c.id].length > 0
  );
  const withoutFeedback = concepts.filter(
    (c) => !allFeedback[c.id] || allFeedback[c.id].length === 0
  );

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate({ name: 'gallery' })}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-6"
      >
        ← Gallery
      </button>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">Feedback Results</h1>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Responses', value: totalResponses },
          { label: 'Concepts Rated', value: `${conceptsRated} / ${concepts.length}` },
          {
            label: 'Overall Average',
            value: globalAvg !== null ? globalAvg.toFixed(1) + ' ★' : '—',
          },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
            <div className="text-2xl font-bold text-indigo-600">{value}</div>
            <div className="text-xs text-slate-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {withFeedback.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-4xl mb-3">📭</div>
          <p className="font-medium">No feedback submitted yet.</p>
          <button
            onClick={() => navigate({ name: 'gallery' })}
            className="mt-4 text-indigo-600 text-sm font-medium hover:underline"
          >
            Explore concepts →
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {withFeedback.map((concept) => {
            const entries = allFeedback[concept.id];
            const avg = entries.reduce((s, e) => s + e.rating, 0) / entries.length;
            const dist = [5, 4, 3, 2, 1].map((star) => ({
              star,
              count: entries.filter((e) => e.rating === star).length,
            }));
            const withComments = entries.filter((e) => e.comment).slice(0, 3);

            return (
              <div
                key={concept.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: concept.color + '18', color: concept.color }}
                      >
                        {concept.category}
                      </span>
                    </div>
                    <h2 className="font-bold text-slate-800 text-lg">{concept.title}</h2>
                  </div>
                  <button
                    onClick={() => navigate({ name: 'detail', conceptId: concept.id })}
                    className="text-sm text-indigo-600 font-medium hover:underline shrink-0"
                  >
                    View →
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex flex-col items-center justify-center bg-slate-50 rounded-xl p-4 min-w-24">
                    <span className="text-3xl font-bold text-slate-800">{avg.toFixed(1)}</span>
                    <StarRating value={Math.round(avg)} readOnly size="sm" />
                    <span className="text-xs text-slate-500 mt-1">
                      {entries.length} {entries.length === 1 ? 'rating' : 'ratings'}
                    </span>
                  </div>

                  <div className="flex-1 space-y-1.5">
                    {dist.map(({ star, count }) => (
                      <RatingBar key={star} star={star} count={count} total={entries.length} />
                    ))}
                  </div>
                </div>

                {withComments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Recent Comments
                    </p>
                    {withComments.map((entry, i) => (
                      <div key={i} className="text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                        <span className="text-amber-400 mr-1">{'★'.repeat(entry.rating)}</span>
                        {entry.comment}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {withoutFeedback.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
            No feedback yet
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {withoutFeedback.map((concept) => (
              <button
                key={concept.id}
                onClick={() => navigate({ name: 'detail', conceptId: concept.id })}
                className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all text-left group"
              >
                <div
                  className="w-2 h-8 rounded-full shrink-0"
                  style={{ backgroundColor: concept.color }}
                />
                <div>
                  <p className="font-medium text-slate-700 group-hover:text-indigo-600 text-sm">
                    {concept.title}
                  </p>
                  <p className="text-xs text-slate-400">{concept.category}</p>
                </div>
                <span className="ml-auto text-slate-300 group-hover:text-indigo-400">→</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
