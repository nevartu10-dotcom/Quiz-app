import { useState } from 'react';

function ProfileCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="h-20 bg-gradient-to-r from-indigo-500 to-purple-600" />
      <div className="px-5 pb-5">
        <div className="flex items-end gap-3 -mt-8 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 border-4 border-white flex items-center justify-center text-white text-xl font-bold shadow-sm">
            JD
          </div>
        </div>
        <h3 className="font-bold text-slate-800 text-lg leading-tight">Jane Doe</h3>
        <p className="text-sm text-slate-500 mb-4">Senior UI Designer · San Francisco</p>
        <div className="grid grid-cols-3 gap-2 text-center border-t border-slate-100 pt-4">
          {[
            { label: 'Projects', value: '42' },
            { label: 'Followers', value: '1.2k' },
            { label: 'Following', value: '284' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="font-bold text-slate-800">{value}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>
        <button className="mt-4 w-full py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 active:scale-95 transition-all duration-150">
          Follow
        </button>
      </div>
    </div>
  );
}

function ProductCard() {
  const [inCart, setInCart] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="h-40 bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-500 flex items-center justify-center">
        <span className="text-5xl">🎧</span>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-bold text-slate-800">Pro Headphones X3</h3>
          <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">New</span>
        </div>
        <p className="text-xs text-slate-400 mb-3">Wireless · Noise-cancelling · 30hr battery</p>
        <div className="flex items-center gap-1 mb-3">
          {[1,2,3,4,5].map((s) => (
            <span key={s} className={s <= 4 ? 'text-amber-400 text-sm' : 'text-slate-200 text-sm'}>★</span>
          ))}
          <span className="text-xs text-slate-400 ml-1">(128)</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-slate-800">$249</span>
            <span className="text-sm text-slate-400 line-through ml-1.5">$299</span>
          </div>
          <button
            onClick={() => setInCart((p) => !p)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95 ${
              inCart
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {inCart ? '✓ In Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard() {
  const [trending, setTrending] = useState(true);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">Monthly Revenue</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">$48,295</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-xl">
          💰
        </div>
      </div>
      <button
        onClick={() => setTrending((p) => !p)}
        className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full transition-all duration-200 ${
          trending
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-red-100 text-red-700'
        }`}
      >
        <span>{trending ? '↑' : '↓'}</span>
        <span>{trending ? '+12.5%' : '-3.2%'}</span>
        <span className="font-normal text-xs">(click to toggle)</span>
      </button>
      <div className="border-t border-slate-100 pt-3">
        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
          <span>vs. last month</span>
          <span>$43,080</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
            style={{ width: trending ? '72%' : '45%' }}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
        {[
          { label: 'Orders', value: '1,284', icon: '📦' },
          { label: 'Customers', value: '892', icon: '👥' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-slate-50 rounded-lg p-3">
            <span className="text-lg">{icon}</span>
            <p className="font-bold text-slate-700 mt-1">{value}</p>
            <p className="text-xs text-slate-400">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CardShowcase() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Profile Card</h3>
          <ProfileCard />
        </div>
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Product Card</h3>
          <ProductCard />
        </div>
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Stat Card</h3>
          <StatCard />
        </div>
      </div>
    </div>
  );
}
