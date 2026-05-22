import { useState } from 'react';
import { useFeedback } from './hooks/useFeedback';
import Header from './components/Header';
import Gallery from './pages/Gallery';
import ConceptDetail from './pages/ConceptDetail';
import ResultsPage from './pages/ResultsPage';

export default function App() {
  const [page, setPage] = useState({ name: 'gallery' });
  const feedback = useFeedback();

  function navigate(target) {
    setPage(target);
    window.scrollTo(0, 0);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header navigate={navigate} />
      {page.name === 'gallery' && (
        <Gallery navigate={navigate} feedback={feedback} />
      )}
      {page.name === 'detail' && (
        <ConceptDetail
          conceptId={page.conceptId}
          navigate={navigate}
          feedback={feedback}
        />
      )}
      {page.name === 'results' && (
        <ResultsPage navigate={navigate} feedback={feedback} />
      )}
    </div>
  );
}
