# Memo Map

A mobile-first web app for location-based memos. Memos are pinned to a place and shown on a map and in a list.

## Features

- **Map:** an OpenStreetMap map (Leaflet) showing every memo as a pin, plus your current position.
  - Tap **+** to add a memo at your current location. If location isn't available, the memo goes at the center of the map.
  - **Long-press** (or right-click on desktop) anywhere on the map to add a memo at that exact spot.
  - Tap a pin to read the memo and edit it.
- **Speech or typing:** the mic button in the editor uses the browser's Web Speech API to dictate into the text box. You can still type or correct the text afterwards.
- **List page:** every memo, with search and sorting by *Recent* or *Nearby*, which uses distance from you. Tap **Show on map** to jump to a memo's pin.
- Memos are saved in the browser's `localStorage`, so they survive reloads.
- **Installable and offline (PWA):** a service worker caches the app and every map tile you view, so the app opens and shows your memos without a connection. The Memos page has an **Install** button on Android/desktop Chrome and Edge, and Add to Home Screen instructions on iPhone. Voice input still needs a connection.

## Run

```bash
npm install
npm run dev      # served on your LAN too (--host)
npm run build
```

### Testing on a phone

Location and microphone access only work over **HTTPS** or on `localhost`. A plain `http://192.168.x.x:5173` address won't get location or speech access on a phone. Use an HTTPS tunnel, for example `npx localtunnel --port 5173` or ngrok, or deploy the `dist/` build to any static host (Netlify, Vercel, GitHub Pages). On the phone, use "Add to Home Screen" to run it full-screen like an app.

### Live version (GitHub Pages)

`.github/workflows/deploy-memo-map.yml` builds and deploys the app to
https://nevartu10-dotcom.github.io/Quiz-app/ on every push to the default branch that changes `memo-map/`.
You can also start it by hand from the Actions tab. For this to work, the repository's
**Settings → Pages → Build and deployment → Source** must be set to **GitHub Actions**.

## Known limitations

- **Speech recognition support varies by browser.** It works in Chrome (Android/desktop), Edge and Safari (iOS 14.5+/macOS). Firefox doesn't support it, and there the mic button is hidden, so only typing is available. Chrome sends the audio to Google's servers to transcribe it.
- Memos live only on this device and browser. There is no account or sync, and clearing site data deletes them.
- Map tiles come from the public OpenStreetMap servers, which need a network connection and are subject to OSM's [tile usage policy](https://operations.osmfoundation.org/policies/tiles/). For a real public release, switch to a tile provider such as MapTiler, Stadia or Mapbox.
