import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Circle, MapContainer, Marker, Polygon, Polyline, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { formatArea, formatDistance, formatDuration, formatWidth, recordingTitle } from '../lib/format';
import { trackLength } from '../lib/track';

const userIcon = L.divIcon({ className: '', html: '<div class="user-dot"></div>', iconSize: [18, 18], iconAnchor: [9, 9] });
const FALLBACK_CENTER = [60.17, 24.94];

const SAVED_STYLE = { color: '#15803d', weight: 1, fillColor: '#22c55e', fillOpacity: 0.45 };
const FOCUSED_STYLE = { color: '#b45309', weight: 2, fillColor: '#f59e0b', fillOpacity: 0.55 };
const LIVE_COLOR = '#ea580c';

/** Metres covered by one screen pixel at this latitude and zoom (Web Mercator). */
function metersPerPixel(lat, zoom) {
  return (40075016.686 * Math.cos((lat * Math.PI) / 180)) / 2 ** (zoom + 8);
}

/** Stops taps/drags on overlay buttons from also panning or zooming the map. */
function useIsolatedFromMap() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    L.DomEvent.disableClickPropagation(ref.current);
    L.DomEvent.disableScrollPropagation(ref.current);
  });
  return ref;
}

function MapEvents({ onMove, onUserPan }) {
  useMapEvents({
    moveend: (e) => {
      const c = e.target.getCenter();
      onMove({ lat: c.lat, lng: c.lng }, e.target.getZoom());
    },
    dragstart: onUserPan,
  });
  return null;
}

/** Centers on the user the first time a position arrives (unless the map already has a view). */
function InitialCenter({ position, skip }) {
  const map = useMap();
  const done = useRef(skip);
  useEffect(() => {
    if (!done.current && position) {
      map.setView([position.lat, position.lng], 18);
      done.current = true;
    }
  }, [map, position]);
  return null;
}

/** Keeps the user in view while recording, until they pan the map themselves. */
function Follow({ position, enabled }) {
  const map = useMap();
  useEffect(() => {
    if (enabled && position) map.panTo([position.lat, position.lng], { animate: true });
  }, [map, position, enabled]);
  return null;
}

function FocusRecording({ recording }) {
  const map = useMap();
  useEffect(() => {
    if (!recording) return;
    const pts = recording.segments.flat();
    if (pts.length === 0) return;
    map.fitBounds(L.latLngBounds(pts.map((p) => [p[0], p[1]])), { padding: [40, 40], maxZoom: 19 });
  }, [map, recording]);
  return null;
}

/**
 * The painting in progress, drawn as a line exactly as thick as the tool at the
 * current zoom. A single stroked path doesn't darken where it overlaps itself, so
 * this looks the same as the merged area and appears instantly with every fix.
 */
function LivePaint({ active }) {
  const map = useMap();
  const [zoom, setZoom] = useState(() => map.getZoom());
  useMapEvents({ zoomend: () => setZoom(map.getZoom()) });

  const first = active.segments[0]?.[0];
  if (!first) return null;
  const weight = Math.max(3, active.widthCm / 100 / metersPerPixel(first[0], zoom));
  return active.segments.map((seg, i) =>
    seg.length > 1 ? (
      <Polyline
        key={`${i}-${weight}`}
        positions={seg.map((p) => [p[0], p[1]])}
        interactive={false}
        pathOptions={{ color: LIVE_COLOR, weight, opacity: 0.6, lineCap: 'butt', lineJoin: 'round' }}
      />
    ) : null,
  );
}

function LocateButton({ position, onLocate }) {
  const map = useMap();
  const ref = useIsolatedFromMap();
  if (!position) return null;
  return (
    <button
      ref={ref}
      onClick={() => {
        map.flyTo([position.lat, position.lng], Math.max(map.getZoom(), 18));
        onLocate();
      }}
      aria-label="Center on my location"
      className="absolute right-4 bottom-28 z-[500] flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl shadow-lg active:bg-slate-100"
    >
      🎯
    </button>
  );
}

function RecordButton({ recording, disabled, onStart, onStop }) {
  const ref = useIsolatedFromMap();
  return (
    <div ref={ref} className="absolute bottom-6 left-1/2 z-[500] -translate-x-1/2">
      {recording ? (
        <button
          onClick={onStop}
          aria-label="Stop painting"
          className="flex h-18 w-18 items-center justify-center rounded-full bg-red-600 shadow-xl ring-4 ring-white active:bg-red-700"
        >
          <span className="h-6 w-6 rounded-sm bg-white" />
        </button>
      ) : (
        <button
          onClick={onStart}
          disabled={disabled}
          aria-label="Start painting"
          className="flex h-18 w-18 items-center justify-center rounded-full bg-emerald-600 shadow-xl ring-4 ring-white active:bg-emerald-700 disabled:bg-slate-400"
        >
          <span className="h-7 w-7 rounded-full bg-white" />
        </button>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="min-w-0">
      <div className="text-[11px] tracking-wide text-slate-500 uppercase">{label}</div>
      <div className="truncate text-lg font-semibold text-slate-900 tabular-nums">{value}</div>
    </div>
  );
}

function RecordingPanel({ active, liveArea, now, position }) {
  return (
    <div className="pointer-events-none absolute top-3 right-3 left-3 z-[500] rounded-2xl bg-white/95 p-3 shadow-lg">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-red-600">
        <span className="rec-dot" /> PAINTING · {formatWidth(active.widthCm)} tool
        <span className="ml-auto font-normal text-slate-500">
          {position ? `GPS ±${Math.round(position.accuracy)} m` : 'No GPS'}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Stat label="Area" value={liveArea == null ? '–' : formatArea(liveArea)} />
        <Stat label="Time" value={formatDuration(now - active.startedAt)} />
        <Stat label="Distance" value={formatDistance(trackLength(active.segments))} />
      </div>
    </div>
  );
}

function IdlePanel({ widthCm, onEditWidth, geoError, online, position }) {
  const ref = useIsolatedFromMap();
  let note = null;
  if (!online) note = "You're offline. Recording works; only map areas you've viewed before will show.";
  else if (geoError) note = geoError;
  else if (!position) note = 'Waiting for a GPS signal…';
  else if (position.accuracy > 25) note = `GPS is weak (±${Math.round(position.accuracy)} m). Fixes this inaccurate are skipped.`;

  return (
    <div ref={ref} className="absolute top-3 right-3 left-3 z-[500] flex flex-col gap-2">
      <button
        onClick={onEditWidth}
        className="flex items-center gap-3 self-start rounded-2xl bg-white/95 px-4 py-2.5 text-left shadow-lg active:bg-slate-100"
      >
        <span className="text-2xl">📏</span>
        <span>
          <span className="block text-[11px] tracking-wide text-slate-500 uppercase">Tool width</span>
          <span className="block text-lg leading-tight font-semibold text-slate-900">{formatWidth(widthCm)}</span>
        </span>
        <span className="ml-2 text-sm font-semibold text-emerald-700">Change</span>
      </button>
      {note && <div className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900 shadow">{note}</div>}
    </div>
  );
}

export default function MapPage({
  recordings,
  savedSwaths,
  active,
  liveArea,
  now,
  position,
  geoError,
  online,
  widthCm,
  focusedId,
  view,
  onViewChange,
  onEditWidth,
  onStart,
  onStop,
  onShowDetails,
}) {
  const [follow, setFollow] = useState(true);
  const focused = recordings.find((r) => r.id === focusedId);
  const start = view ?? (position ? { center: position, zoom: 18 } : null);
  const recording = Boolean(active && !active.endedAt);

  return (
    <div className="relative h-full">
      <MapContainer
        center={start ? [start.center.lat, start.center.lng] : FALLBACK_CENTER}
        zoom={start?.zoom ?? 13}
        maxZoom={21}
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxNativeZoom={19}
          maxZoom={21}
          crossOrigin=""
        />
        <MapEvents onMove={(center, zoom) => onViewChange({ center, zoom })} onUserPan={() => setFollow(false)} />
        <InitialCenter position={position} skip={Boolean(view || focused)} />
        <Follow position={position} enabled={recording && follow} />
        <FocusRecording recording={focused} />

        {recordings.map((rec) => {
          const swath = savedSwaths[rec.id];
          if (!swath) return null;
          return (
            <Polygon
              key={`${rec.id}-${rec.id === focusedId}`}
              positions={swath.polygons}
              pathOptions={rec.id === focusedId ? FOCUSED_STYLE : SAVED_STYLE}
            >
              <Popup>
                <div className="min-w-40">
                  <p className="m-0! text-sm font-semibold text-slate-900">{recordingTitle(rec)}</p>
                  <p className="m-0! mt-1! text-sm text-slate-700">
                    {formatArea(rec.areaM2)} · {formatDuration(rec.endedAt - rec.startedAt)}
                  </p>
                  <button onClick={() => onShowDetails(rec)} className="mt-2 text-sm font-semibold text-emerald-700">
                    Details
                  </button>
                </div>
              </Popup>
            </Polygon>
          );
        })}

        {active && <LivePaint active={active} />}

        {position && (
          <>
            <Circle
              center={[position.lat, position.lng]}
              radius={position.accuracy}
              interactive={false}
              pathOptions={{ color: '#2563eb', weight: 1, opacity: 0.4, fillOpacity: 0.08 }}
            />
            <Marker position={[position.lat, position.lng]} icon={userIcon} interactive={false} />
          </>
        )}

        <LocateButton position={position} onLocate={() => setFollow(true)} />
        <RecordButton
          recording={recording}
          disabled={!position && !recording}
          onStart={() => {
            setFollow(true);
            onStart();
          }}
          onStop={onStop}
        />
      </MapContainer>

      {recording ? (
        <RecordingPanel active={active} liveArea={liveArea} now={now} position={position} />
      ) : (
        <IdlePanel widthCm={widthCm} onEditWidth={onEditWidth} geoError={geoError} online={online} position={position} />
      )}
    </div>
  );
}
