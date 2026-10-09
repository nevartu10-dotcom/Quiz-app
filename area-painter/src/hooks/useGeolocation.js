import { useEffect, useRef, useState } from 'react';

/**
 * Watches the device position. `position` is { lat, lng, accuracy, time } or null.
 * `onFix` is called with every fix.
 */
export function useGeolocation(onFix) {
  const supported = typeof navigator !== 'undefined' && 'geolocation' in navigator;
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(supported ? null : 'Location is not supported on this device.');
  const onFixRef = useRef(onFix);

  useEffect(() => {
    onFixRef.current = onFix;
  }, [onFix]);

  useEffect(() => {
    if (!supported) return;
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const fix = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          time: pos.timestamp,
        };
        setPosition(fix);
        setError(null);
        onFixRef.current?.(fix);
      },
      (err) => {
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'Location permission denied. Allow location access to record.'
            : 'Waiting for a GPS signal…',
        );
      },
      // Fresh fixes only: a cached position would paint where you were, not where you are.
      { enableHighAccuracy: true, maximumAge: 0, timeout: 30000 },
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [supported]);

  return { position, error };
}
