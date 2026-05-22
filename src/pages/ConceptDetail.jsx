import { lazy, Suspense } from 'react';
import { concepts } from '../data/concepts';
import FeedbackForm from '../components/FeedbackForm';
import FeedbackSummary from '../components/FeedbackSummary';

const showcaseMap = {
  ButtonShowcase: lazy(() => import('../concepts/ButtonShowcase')),
  FormShowcase: lazy(() => import('../concepts/FormShowcase')),
  CardShowcase: lazy(() => import('../concepts/CardShowcase')),
  ModalShowcase: lazy(() => import('../concepts/ModalShowcase')),
  NavigationShowcase: lazy(() => import('../concepts/NavigationShowcase')),
  TabsShowcase: lazy(() => import('../concepts/TabsShowcase')),
};

export default function ConceptDetail({ conceptId, navigate, feedback }) {
  const concept = concepts.find((c) => c.id === conceptId);
  if (!concept) return null;

  const ShowcaseComponent = showcaseMap[concept.component];
  const entries = feedback.getFeedbackForConcept(conceptId);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate({ name: 'gallery' })}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-6"
      >
        ← Gallery
      </button>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span
            className="text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full"
            style={{ backgroundColor: concept.color + '18', color: concept.color }}
          >
            {concept.category}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{concept.title}</h1>
        <p className="text-slate-500 mt-1">{concept.description}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Demo area */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div
              className="h-1 w-full rounded-t-xl -mx-6 -mt-6 mb-6"
              style={{ backgroundColor: concept.color }}
            />
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-20 text-slate-400">
                  <span className="inline-block w-6 h-6 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin mr-2" />
                  Loading demo...
                </div>
              }
            >
              <ShowcaseComponent />
            </Suspense>
          </div>
        </div>

        {/* Feedback panel */}
        <div className="lg:w-80 xl:w-96 shrink-0 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-800 mb-4">Rate this concept</h2>
            <FeedbackForm
              conceptId={conceptId}
              onSubmit={feedback.submitFeedback}
            />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-800 mb-4">
              Reviews{' '}
              {entries.length > 0 && (
                <span className="text-sm font-normal text-slate-400">({entries.length})</span>
              )}
            </h2>
            <FeedbackSummary entries={entries} />
          </div>
        </div>
      </div>
    </main>
  );
}
