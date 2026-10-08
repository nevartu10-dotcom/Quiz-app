import { useEffect, useState } from 'react';

/** Watches the device position. `position` is { lat, lng, accuracy } or null. */
export function useGeolocation() {
  const supported = typeof navigator !== 'undefined' && 'geolocation' in navigator;
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(supported ? null : 'Geolocation is not supported on this device.');

  useEffect(() => {
    if (!supported) return;
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setError(null);
      },
      (err) => {
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'Location permission denied. Long-press the map to place memos manually.'
            : 'Could not determine your location.',
        );
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 },
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [supported]);

  return { position, error };
}
