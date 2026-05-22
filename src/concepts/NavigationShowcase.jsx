import { useState } from 'react';

const navLinks = [
  { label: 'Home', icon: '🏠' },
  { label: 'Products', icon: '📦' },
  { label: 'Blog', icon: '📝' },
  { label: 'About', icon: 'ℹ️' },
  { label: 'Contact', icon: '📞' },
];

const sidebarSections = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', icon: '📊' },
      { label: 'Analytics', icon: '📈' },
      { label: 'Reports', icon: '📋' },
    ],
  },
  {
    label: 'Manage',
    items: [
      { label: 'Users', icon: '👥' },
      { label: 'Settings', icon: '⚙️' },
      { label: 'Billing', icon: '💳' },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Posts', icon: '✍️' },
      { label: 'Media', icon: '🖼️' },
      { label: 'Comments', icon: '💬' },
    ],
  },
];

const initialBreadcrumbs = ['Home', 'Products', 'Electronics', 'Headphones', 'Pro X3'];

export default function NavigationShowcase() {
  const [activeNav, setActiveNav] = useState('Home');
  const [breadcrumbs, setBreadcrumbs] = useState(initialBreadcrumbs);
  const [activeSidebar, setActiveSidebar] = useState('Dashboard');
  const [expandedSection, setExpandedSection] = useState('Main');

  function clickBreadcrumb(index) {
    setBreadcrumbs(breadcrumbs.slice(0, index + 1));
  }

  function resetBreadcrumbs() {
    setBreadcrumbs(initialBreadcrumbs);
  }

  return (
    <div className="space-y-8">
      {/* Top Nav */}
      <section>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Top Navigation</h3>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                L
              </div>
              <span className="font-bold text-slate-800 text-sm">LogoMark</span>
            </div>
            <nav className="flex items-center gap-1">
              {navLinks.map(({ label }) => (
                <button
                  key={label}
                  onClick={() => setActiveNav(label)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                    activeNav === label
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
            <button className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
              Sign In
            </button>
          </div>
          <div className="px-4 py-3 text-sm text-slate-500 bg-slate-50">
            Active page: <strong className="text-slate-700">{activeNav}</strong>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Breadcrumb Trail</h3>
          <button
            onClick={resetBreadcrumbs}
            className="text-xs text-indigo-600 hover:underline"
          >
            Reset
          </button>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex flex-wrap items-center gap-1 shadow-sm">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span className="text-slate-300 text-sm">/</span>}
              {i < breadcrumbs.length - 1 ? (
                <button
                  onClick={() => clickBreadcrumb(i)}
                  className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline font-medium transition-colors"
                >
                  {crumb}
                </button>
              ) : (
                <span className="text-sm text-slate-700 font-semibold">{crumb}</span>
              )}
            </span>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-1.5">Click any segment to navigate up the trail</p>
      </section>

      {/* Sidebar */}
      <section>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Vertical Sidebar</h3>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex" style={{ height: '280px' }}>
          {/* Sidebar */}
          <div className="w-52 border-r border-slate-100 flex flex-col overflow-y-auto">
            <div className="p-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  A
                </div>
                <span className="text-sm font-bold text-slate-700">Admin Panel</span>
              </div>
            </div>
            <nav className="p-2 flex-1">
              {sidebarSections.map(({ label, items }) => (
                <div key={label} className="mb-1">
                  <button
                    onClick={() => setExpandedSection(expandedSection === label ? null : label)}
                    className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wide hover:text-slate-600 transition-colors"
                  >
                    <span>{label}</span>
                    <span className="text-slate-300">{expandedSection === label ? '▾' : '▸'}</span>
                  </button>
                  {expandedSection === label && (
                    <div className="space-y-0.5">
                      {items.map(({ label: itemLabel, icon }) => (
                        <button
                          key={itemLabel}
                          onClick={() => setActiveSidebar(itemLabel)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                            activeSidebar === itemLabel
                              ? 'bg-indigo-600 text-white font-medium'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                          }`}
                        >
                          <span className="text-base">{icon}</span>
                          <span>{itemLabel}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
          {/* Main content */}
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
            <div className="text-4xl mb-3">
              {sidebarSections.flatMap((s) => s.items).find((i) => i.label === activeSidebar)?.icon || '📊'}
            </div>
            <p className="font-semibold text-slate-700">{activeSidebar}</p>
            <p className="text-xs text-slate-400 mt-1">Content area for {activeSidebar}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
