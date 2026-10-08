import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { formatDate } from '../lib/geo';

const memoIcon = L.divIcon({ className: '', html: '<div class="memo-pin"></div>', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -28] });
const activeMemoIcon = L.divIcon({ className: '', html: '<div class="memo-pin active"></div>', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -28] });
const userIcon = L.divIcon({ className: '', html: '<div class="user-dot"></div>', iconSize: [18, 18], iconAnchor: [9, 9] });

const FALLBACK_CENTER = [51.505, -0.09];

function MapEvents({ onLongPress, onMove }) {
  useMapEvents({
    contextmenu: (e) => onLongPress({ lat: e.latlng.lat, lng: e.latlng.lng }),
    moveend: (e) => {
      const c = e.target.getCenter();
      onMove({ lat: c.lat, lng: c.lng }, e.target.getZoom());
    },
  });
  return null;
}

/** Centers on the user the first time a position arrives (unless a memo is focused). */
function InitialCenter({ position, skip }) {
  const map = useMap();
  const done = useRef(skip);
  useEffect(() => {
    if (!done.current && position) {
      map.setView([position.lat, position.lng], 16);
      done.current = true;
    }
  }, [map, position]);
  return null;
}

function FocusMemo({ memo, markerRefs }) {
  const map = useMap();
  useEffect(() => {
    if (!memo) return;
    map.setView([memo.location.lat, memo.location.lng], Math.max(map.getZoom(), 16));
    // Wait a tick so the marker is rendered before opening its popup.
    const t = setTimeout(() => markerRefs.current[memo.id]?.openPopup(), 50);
    return () => clearTimeout(t);
  }, [map, memo, markerRefs]);
  return null;
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

function LocateButton({ position }) {
  const map = useMap();
  const ref = useIsolatedFromMap();
  if (!position) return null;
  return (
    <button
      ref={ref}
      onClick={() => map.flyTo([position.lat, position.lng], Math.max(map.getZoom(), 16))}
      aria-label="Center on my location"
      className="absolute top-4 right-4 z-[500] flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl shadow-lg active:bg-slate-100"
    >
      🎯
    </button>
  );
}

function AddButton({ position, onAddAt }) {
  const map = useMap();
  const ref = useIsolatedFromMap();
  function handleClick() {
    // Prefer the device position; without it, pin to the middle of the visible map.
    const c = position ?? map.getCenter();
    onAddAt({ lat: c.lat, lng: c.lng });
  }
  return (
    <button
      ref={ref}
      onClick={handleClick}
      aria-label="Add memo"
      className="absolute right-5 bottom-6 z-[500] flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-4xl font-light text-white shadow-xl active:bg-indigo-700"
    >
      +
    </button>
  );
}

export default function MapPage({ memos, position, geoError, focusedId, view, onViewChange, onAddAt, onEdit }) {
  const markerRefs = useRef({});
  const focused = memos.find((m) => m.id === focusedId);
  const start = view ?? (position ? { center: position, zoom: 16 } : null);

  return (
    <div className="relative h-full">
      <MapContainer
        center={start ? [start.center.lat, start.center.lng] : FALLBACK_CENTER}
        zoom={start?.zoom ?? 13}
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <MapEvents onLongPress={onAddAt} onMove={(center, zoom) => onViewChange({ center, zoom })} />
        <InitialCenter position={position} skip={Boolean(view || focused)} />
        <FocusMemo memo={focused} markerRefs={markerRefs} />
        <LocateButton position={position} />
        <AddButton position={position} onAddAt={onAddAt} />

        {position && <Marker position={[position.lat, position.lng]} icon={userIcon} interactive={false} />}

        {memos.map((memo) => (
          <Marker
            key={memo.id}
            position={[memo.location.lat, memo.location.lng]}
            icon={memo.id === focusedId ? activeMemoIcon : memoIcon}
            ref={(ref) => {
              if (ref) markerRefs.current[memo.id] = ref;
              else delete markerRefs.current[memo.id];
            }}
          >
            <Popup>
              <div className="max-w-56">
                <p className="m-0! text-sm whitespace-pre-wrap text-slate-900">{memo.text}</p>
                <p className="m-0! mt-1! text-xs text-slate-500">
                  {memo.source === 'speech' ? '🎤 ' : '⌨️ '}
                  {formatDate(memo.createdAt)}
                </p>
                <button onClick={() => onEdit(memo)} className="mt-2 text-sm font-semibold text-indigo-600">
                  Edit
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {geoError && (
        <div className="absolute top-4 right-18 left-4 z-[500] rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800 shadow">
          {geoError}
        </div>
      )}
      {!geoError && memos.length === 0 && (
        <div className="pointer-events-none absolute top-4 right-18 left-4 z-[500] rounded-xl bg-white/95 px-3 py-2 text-xs text-slate-600 shadow">
          Tap <b>+</b> to add a memo at your location, or long-press anywhere on the map.
        </div>
      )}

    </div>
  );
}
