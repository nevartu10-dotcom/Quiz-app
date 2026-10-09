# Area Painter

A mobile-first web app that measures the ground you cover. Set the working width of your tool (mower, spreader, sprayer, brush…) in centimetres, press record and move. The app paints a strip of that width along your path on the map and works out the area.

## Features

- **Tool width in cm:** set it before recording. Presets go from 30 cm to 12 m, and any value from 1 to 5000 cm works. The app remembers it.
- **Live painting:** while recording, your path is painted on the map at the tool's true width, with the live area, elapsed time, distance and GPS accuracy shown on top. The map follows you until you pan it. 🎯 turns following back on.
- **Result:** when you stop, the painted area, time, distance and work rate (m²/h or ha/h) are shown, and you can name the recording.
- **Recordings on the map and in a list:** every saved recording stays painted on the map (tap one for details). The *Recordings* tab lists them all with area, time, width and distance, and **Show on map** zooms to one.
- **Installable and offline (PWA):** works without a connection. Map tiles you've already viewed are cached.

## How the area is calculated

The track is projected to local metres and *buffered* by half the tool width on each side (flat ends, rounded turns), using [JSTS](https://github.com/bjornharrtell/jsts). The result is one merged shape, so **ground you pass over twice is counted once**. The calculation runs in a Web Worker so the UI stays smooth on long recordings. `npm test` covers the geometry: straight strips, overlapping and adjacent passes, gaps, and narrow tools.

GPS fixes are filtered before they are used (`src/lib/track.js`):

| Rule | Value | Why |
| --- | --- | --- |
| Skip fixes less accurate than | 25 m | A weak fix paints in the wrong place |
| Skip movement smaller than | 1 m | Avoids painting a blob while standing still |
| Skip jumps faster than | 50 m/s | GPS glitches |
| Start a new segment after a pause of | 15 s | Don't paint a straight line across ground you may not have covered |

## Run

```bash
npm install
npm run dev      # served on your LAN too (--host)
npm test         # geometry and GPS-filter tests
npm run build
```

Location only works over **HTTPS** or on `localhost`. To try it on a phone, use the live version below, an HTTPS tunnel (`npx localtunnel --port 5173`), or any static host.

### Live version (GitHub Pages)

`.github/workflows/deploy-memo-map.yml` builds both apps. Area Painter is served at
https://nevartu10-dotcom.github.io/Quiz-app/area-painter/ next to Memo Map at the site root.

## Known limitations

- **Accuracy is limited by the phone's GPS.** A typical phone is accurate to about 3–10 m in open sky and worse near buildings and trees. Over a large area the errors partly average out. With a narrow tool (e.g. 30 cm) on a small patch, though, the GPS wobble is bigger than the tool, so the painted shape and area are rough estimates. The GPS ±m figure on screen shows the current accuracy. For centimetre-level work you'd need an external RTK GPS receiver.
- **Keep the app open with the screen on while recording.** Browsers pause location updates for pages in the background or with the screen locked, especially on iPhone. The app keeps the screen awake while recording (Screen Wake Lock, where supported), and a gap in updates becomes a gap in the painting rather than a straight line. Real background tracking would need a native wrapper such as Capacitor.
- Recordings live only on this device and browser, in `localStorage` (about 30 bytes per GPS point, so roughly 100 KB per hour). The browser's limit of about 5 MB fits dozens of hours. If it fills up, the Recordings page tells you. There is no account or sync.
- The tool width can't be changed during a recording.
- Map tiles come from the public OpenStreetMap servers, which are subject to OSM's [tile usage policy](https://operations.osmfoundation.org/policies/tiles/). For a real public release, switch to a tile provider.
