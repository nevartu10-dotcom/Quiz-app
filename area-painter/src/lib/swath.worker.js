import { computeSwath } from './swath.js';

// Swath geometry for long tracks takes long enough to stall the UI, so it runs here.
self.onmessage = (e) => {
  const { id, segments, widthM } = e.data;
  try {
    self.postMessage({ id, ...computeSwath(segments, widthM) });
  } catch (err) {
    self.postMessage({ id, error: String(err) });
  }
};
