/** A bottom sheet over the whole app. */
export default function Sheet({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-end bg-black/40" onClick={onClose}>
      <div
        className="w-full rounded-t-3xl bg-white p-5 pb-[calc(env(safe-area-inset-bottom)+20px)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
