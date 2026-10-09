export const KEYS = {
  recordings: 'area-painter:recordings',
  active: 'area-painter:active',
  widthCm: 'area-painter:width-cm',
};

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/** Returns false if the data could not be saved (storage full or unavailable). */
export function save(key, value) {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
