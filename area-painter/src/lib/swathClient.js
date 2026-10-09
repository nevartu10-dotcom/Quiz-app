let worker = null;
let nextId = 1;
const pending = new Map();

function getWorker() {
  if (worker) return worker;
  worker = new Worker(new URL('./swath.worker.js', import.meta.url), { type: 'module' });
  worker.onmessage = (e) => {
    const { id, error, ...result } = e.data;
    const p = pending.get(id);
    if (!p) return;
    pending.delete(id);
    if (error) p.reject(new Error(error));
    else p.resolve(result);
  };
  return worker;
}

/** Computes the painted area off the main thread. Resolves to { areaM2, polygons }. */
export function computeSwathAsync(segments, widthM) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    getWorker().postMessage({ id, segments, widthM });
  });
}
