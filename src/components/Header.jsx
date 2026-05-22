export default function Header({ navigate }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => navigate({ name: 'gallery' })}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">UI</span>
            </div>
            <span className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
              UI Concepts Lab
            </span>
          </button>

          <nav className="flex items-center gap-2">
            <button
              onClick={() => navigate({ name: 'gallery' })}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
            >
              Gallery
            </button>
            <button
              onClick={() => navigate({ name: 'results' })}
              className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              View All Feedback
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
