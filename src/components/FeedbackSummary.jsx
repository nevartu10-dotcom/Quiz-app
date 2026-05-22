import StarRating from './StarRating';

function relativeTime(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function FeedbackSummary({ entries }) {
  if (!entries || entries.length === 0) {
    return (
      <p className="text-sm text-slate-400 italic">No feedback yet. Be the first to rate!</p>
    );
  }

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
      {entries.map((entry, i) => (
        <div
          key={i}
          className="bg-slate-50 rounded-lg p-3 border border-slate-100"
        >
          <div className="flex items-center justify-between mb-1">
            <StarRating value={entry.rating} readOnly size="sm" />
            <span className="text-xs text-slate-400">{relativeTime(entry.timestamp)}</span>
          </div>
          {entry.comment && (
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{entry.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
}
