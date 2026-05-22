import { useState } from 'react';

function Backdrop({ onClose, children }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

function StandardModal({ onClose }) {
  return (
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-[fadeIn_0.15s_ease]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
              📋
            </div>
            <h2 className="text-base font-bold text-slate-800">New Project</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            ✕
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Project Name</label>
            <input
              type="text"
              placeholder="My Awesome Project"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              rows={3}
              placeholder="What is this project about?"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors active:scale-95"
          >
            Create Project
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

function ConfirmDialog({ onClose }) {
  return (
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            🗑️
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-2">Delete Item?</h2>
          <p className="text-sm text-slate-500 mb-6">
            This action cannot be undone. The item will be permanently removed from your workspace.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Keep It
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors active:scale-95"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </Backdrop>
  );
}

function SideDrawer({ onClose }) {
  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'slideIn 0.2s ease' }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">Notifications</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {[
            { icon: '💬', title: 'New comment on your post', time: '2m ago', color: 'bg-blue-50' },
            { icon: '⭐', title: 'Jane starred your project', time: '15m ago', color: 'bg-amber-50' },
            { icon: '✅', title: 'Build succeeded', time: '1h ago', color: 'bg-emerald-50' },
            { icon: '🔔', title: 'New follower: @alex', time: '3h ago', color: 'bg-indigo-50' },
            { icon: '📧', title: 'You have a new message', time: '5h ago', color: 'bg-purple-50' },
          ].map(({ icon, title, time, color }, i) => (
            <div key={i} className={`${color} rounded-lg p-3 flex gap-3 items-start`}>
              <span className="text-xl">{icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 leading-tight">{title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            Mark all as read
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

export default function ModalShowcase() {
  const [open, setOpen] = useState(null); // 'standard' | 'confirm' | 'drawer'

  return (
    <div className="space-y-6">
      {open === 'standard' && <StandardModal onClose={() => setOpen(null)} />}
      {open === 'confirm' && <ConfirmDialog onClose={() => setOpen(null)} />}
      {open === 'drawer' && <SideDrawer onClose={() => setOpen(null)} />}

      <p className="text-sm text-slate-500">Click a button below to open different overlay types:</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setOpen('standard')}
          className="group flex flex-col items-center gap-3 p-6 bg-white border-2 border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-150"
        >
          <span className="text-3xl">📋</span>
          <div className="text-center">
            <p className="font-semibold text-slate-800 group-hover:text-indigo-700">Standard Modal</p>
            <p className="text-xs text-slate-400 mt-1">Header, body, and footer layout</p>
          </div>
        </button>

        <button
          onClick={() => setOpen('confirm')}
          className="group flex flex-col items-center gap-3 p-6 bg-white border-2 border-slate-200 rounded-xl hover:border-red-400 hover:bg-red-50 transition-all duration-150"
        >
          <span className="text-3xl">⚠️</span>
          <div className="text-center">
            <p className="font-semibold text-slate-800 group-hover:text-red-700">Confirmation Dialog</p>
            <p className="text-xs text-slate-400 mt-1">Destructive action warning</p>
          </div>
        </button>

        <button
          onClick={() => setOpen('drawer')}
          className="group flex flex-col items-center gap-3 p-6 bg-white border-2 border-slate-200 rounded-xl hover:border-amber-400 hover:bg-amber-50 transition-all duration-150"
        >
          <span className="text-3xl">📬</span>
          <div className="text-center">
            <p className="font-semibold text-slate-800 group-hover:text-amber-700">Side Drawer</p>
            <p className="text-xs text-slate-400 mt-1">Slides in from the right</p>
          </div>
        </button>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-500 border border-slate-100">
        <strong className="text-slate-600">Tip:</strong> All overlays can be closed by clicking the backdrop, pressing the ✕ button, or using the action buttons inside.
      </div>
    </div>
  );
}
