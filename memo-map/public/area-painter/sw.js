// Area Painter moved to https://nevartu10-dotcom.github.io/area-painter/.
// This replaces its old service worker here: it unregisters itself and sends open pages to the new address.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      await self.registration.unregister();
      const windows = await self.clients.matchAll({ type: 'window' });
      windows.forEach((c) => c.navigate('https://nevartu10-dotcom.github.io/area-painter/'));
    })(),
  );
});
