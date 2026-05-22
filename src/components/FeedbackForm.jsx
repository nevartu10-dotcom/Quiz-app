import { useState } from 'react';
import StarRating from './StarRating';

export default function FeedbackForm({ conceptId, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!rating) return;
    onSubmit(conceptId, rating, comment);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
        <div className="text-3xl mb-2">🎉</div>
        <p className="font-semibold text-green-800">Thanks for your feedback!</p>
        <p className="text-sm text-green-600 mt-1">Your rating has been saved.</p>
        <button
          onClick={() => {
            setRating(0);
            setComment('');
            setSubmitted(false);
          }}
          className="mt-3 text-sm text-green-700 underline hover:no-underline"
        >
          Submit another rating
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Your Rating <span className="text-red-500">*</span>
        </label>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Comments <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="What did you think about this concept?"
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition"
        />
      </div>

      <button
        type="submit"
        disabled={!rating}
        className="w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
      >
        Submit Feedback
      </button>
    </form>
  );
}
