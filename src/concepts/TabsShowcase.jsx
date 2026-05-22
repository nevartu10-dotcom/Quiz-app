import { useState } from 'react';

const tabContent = {
  Overview: 'This is the Overview tab. It provides a high-level summary of the content and key metrics at a glance.',
  Features: 'The Features tab details all capabilities, functionality, and technical specifications of this component.',
  Pricing: 'Pricing information including tiers, billing options, and enterprise plans are shown here.',
  Support: 'Get help, read documentation, and connect with the support team through the Support tab.',
};

const tabKeys = Object.keys(tabContent);

export default function TabsShowcase() {
  const [underlineTab, setUnderlineTab] = useState('Overview');
  const [pillTab, setPillTab] = useState('Overview');
  const [verticalTab, setVerticalTab] = useState('Overview');

  return (
    <div className="space-y-10">
      {/* Underline Tabs */}
      <section>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Underline Tabs</h3>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="border-b border-slate-200 flex overflow-x-auto">
            {tabKeys.map((tab) => (
              <button
                key={tab}
                onClick={() => setUnderlineTab(tab)}
                className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-all duration-150 border-b-2 -mb-px ${
                  underlineTab === tab
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="p-5">
            <p className="text-sm text-slate-600 leading-relaxed">{tabContent[underlineTab]}</p>
          </div>
        </div>
      </section>

      {/* Pill Tabs */}
      <section>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Pill / Bubble Tabs</h3>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-3 border-b border-slate-100">
            <div className="inline-flex gap-1 bg-slate-100 rounded-lg p-1">
              {tabKeys.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPillTab(tab)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-150 whitespace-nowrap ${
                    pillTab === tab
                      ? 'bg-white text-slate-800 shadow-sm font-semibold'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="p-5">
            <p className="text-sm text-slate-600 leading-relaxed">{tabContent[pillTab]}</p>
          </div>
        </div>
      </section>

      {/* Vertical Tabs */}
      <section>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Vertical Tabs</h3>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex" style={{ minHeight: '200px' }}>
          <div className="border-r border-slate-100 flex flex-col w-40 shrink-0">
            {tabKeys.map((tab) => (
              <button
                key={tab}
                onClick={() => setVerticalTab(tab)}
                className={`px-4 py-3 text-sm font-medium text-left transition-all duration-150 border-l-2 ${
                  verticalTab === tab
                    ? 'border-indigo-600 text-indigo-700 bg-indigo-50'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex-1 p-5 flex items-center">
            <div>
              <h4 className="font-semibold text-slate-800 mb-2">{verticalTab}</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{tabContent[verticalTab]}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
