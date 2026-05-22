import { useState } from 'react';

const labels = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

export default function StarRating({ value, onChange, readOnly = false, size = 'md' }) {
  const [hovered, setHovered] = useState(0);

  const starSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-4xl' : 'text-2xl';
  const displayValue = hovered || value;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange && onChange(star)}
            onMouseEnter={() => !readOnly && setHovered(star)}
            onMouseLeave={() => !readOnly && setHovered(0)}
            className={`${starSize} transition-all duration-100 ${
              readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            } focus:outline-none`}
            aria-label={`Rate ${star} stars`}
          >
            <span
              className={
                star <= displayValue
                  ? 'text-amber-400'
                  : 'text-slate-200'
              }
            >
              ★
            </span>
          </button>
        ))}
      </div>
      {!readOnly && displayValue > 0 && (
        <span className="text-sm text-slate-500">
          {displayValue} - {labels[displayValue]}
        </span>
      )}
    </div>
  );
}
