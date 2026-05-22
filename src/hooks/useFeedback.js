import { useState, useCallback } from 'react';

const STORAGE_KEY = 'ui-concept-feedback';

function loadFeedback() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveFeedback(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
}

export function useFeedback() {
  const [feedbackData, setFeedbackData] = useState(() => loadFeedback());

  const getAllFeedback = useCallback(() => {
    return feedbackData;
  }, [feedbackData]);

  const getFeedbackForConcept = useCallback(
    (id) => {
      return feedbackData[id] || [];
    },
    [feedbackData]
  );

  const submitFeedback = useCallback((id, rating, comment) => {
    setFeedbackData((prev) => {
      const existing = prev[id] || [];
      const entry = {
        rating,
        comment: comment || '',
        timestamp: new Date().toISOString(),
      };
      const updated = { ...prev, [id]: [entry, ...existing] };
      saveFeedback(updated);
      return updated;
    });
  }, []);

  const getAverageRating = useCallback(
    (id) => {
      const entries = feedbackData[id];
      if (!entries || entries.length === 0) return null;
      const sum = entries.reduce((acc, e) => acc + e.rating, 0);
      return sum / entries.length;
    },
    [feedbackData]
  );

  const getTotalResponses = useCallback(
    (id) => {
      return (feedbackData[id] || []).length;
    },
    [feedbackData]
  );

  return {
    getAllFeedback,
    getFeedbackForConcept,
    submitFeedback,
    getAverageRating,
    getTotalResponses,
    feedbackData,
  };
}
