import { useEffect, useRef, useState } from 'react';
import MapPage from './pages/MapPage';
import ListPage from './pages/ListPage';
import TabBar from './components/TabBar';
import WidthSheet from './components/WidthSheet';
import SummarySheet from './components/SummarySheet';
import { useGeolocation } from './hooks/useGeolocation';
import { useOnline } from './hooks/useOnline';
import { useWakeLock } from './hooks/useWakeLock';
import { useNow } from './hooks/useNow';
import { primeSwath, useLiveSwath, useSavedSwaths } from './hooks/useSwath';
import { addFix, clearRecording, startRecording, stopRecording, useActiveRecording } from './lib/recorder';
import { addRecording, deleteRecording, updateRecording, useRecordings } from './lib/recordings';
import { computeSwathAsync } from './lib/swathClient';
import { pointCount, trackLength } from './lib/track';
import { KEYS, load, save } from './lib/storage';

function newId() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function loadWidth() {
  const cm = Number(load(KEYS.widthCm, 100));
  return cm >= 1 ? cm : 100;
}

/** Turns a stopped recording into a saved one. Returns the summary to show. */
async function finalize(stopped) {
  if (pointCount(stopped.segments) < 2) {
    clearRecording();
    return { status: 'empty', durationMs: stopped.endedAt - stopped.startedAt };
  }
  const swath = await computeSwathAsync(stopped.segments, stopped.widthCm / 100);
  const recording = {
    id: newId(),
    name: '',
    widthCm: stopped.widthCm,
    startedAt: stopped.startedAt,
    endedAt: stopped.endedAt,
    segments: stopped.segments,
    areaM2: swath.areaM2,
    distanceM: trackLength(stopped.segments),
  };
  primeSwath(recording, swath);
  addRecording(recording);
  clearRecording();
  return { status: 'done', recording, isNew: true };
}

export default function App() {
  const active = useActiveRecording();
  const { list: recordings, storageFull } = useRecordings();
  const { position, error: geoError } = useGeolocation(addFix);
  const online = useOnline();
  const recording = Boolean(active && !active.endedAt);
  const now = useNow(recording);
  const live = useLiveSwath(recording ? active : null);
  const savedSwaths = useSavedSwaths(recordings);
  useWakeLock(recording);

  const [tab, setTab] = useState('map');
  const [widthCm, setWidthCm] = useState(loadWidth);
  const [editingWidth, setEditingWidth] = useState(false);
  const [focusedId, setFocusedId] = useState(null);
  const [mapView, setMapView] = useState(null);
  // A recording stopped just before the app was closed is finished on the next start.
  const [stoppedAtLaunch] = useState(() => (active?.endedAt ? active : null));
  const [summary, setSummary] = useState(() => (stoppedAtLaunch ? { status: 'calculating' } : null));

  const finishing = useRef(false);
  useEffect(() => {
    if (finishing.current || !stoppedAtLaunch) return;
    finishing.current = true;
    finalize(stoppedAtLaunch).then(setSummary);
  }, [stoppedAtLaunch]);

  function handleStart() {
    setFocusedId(null);
    startRecording(widthCm);
  }

  async function handleStop() {
    const stopped = stopRecording();
    if (!stopped) return;
    setSummary({ status: 'calculating' });
    setSummary(await finalize(stopped));
  }

  function handleSaveWidth(cm) {
    setWidthCm(cm);
    save(KEYS.widthCm, cm);
    setEditingWidth(false);
  }

  function handleDelete(id) {
    deleteRecording(id);
    if (focusedId === id) setFocusedId(null);
    setSummary(null);
  }

  function showOnMap(rec) {
    setSummary(null);
    setFocusedId(rec.id);
    setTab('map');
  }

  return (
    <div className="flex h-full flex-col">
      <main className="relative min-h-0 flex-1">
        {tab === 'map' ? (
          <MapPage
            recordings={recordings}
            savedSwaths={savedSwaths}
            active={active}
            liveArea={live?.areaM2}
            now={now}
            position={position}
            geoError={geoError}
            online={online}
            widthCm={widthCm}
            focusedId={focusedId}
            view={mapView}
            onViewChange={setMapView}
            onEditWidth={() => setEditingWidth(true)}
            onStart={handleStart}
            onStop={handleStop}
            onShowDetails={(rec) => setSummary({ status: 'done', recording: rec, isNew: false })}
          />
        ) : (
          <ListPage
            recordings={recordings}
            storageFull={storageFull}
            onShowOnMap={showOnMap}
            onShowDetails={(rec) => setSummary({ status: 'done', recording: rec, isNew: false })}
          />
        )}
      </main>
      <TabBar
        active={tab}
        onChange={(next) => {
          setFocusedId(null);
          setTab(next);
        }}
        count={recordings.length}
      />

      {editingWidth && (
        <WidthSheet widthCm={widthCm} onSave={handleSaveWidth} onCancel={() => setEditingWidth(false)} />
      )}
      {summary && (
        <SummarySheet
          key={summary.recording?.id ?? summary.status}
          summary={summary}
          onClose={() => setSummary(null)}
          onRename={(id, name) => updateRecording(id, { name })}
          onDelete={handleDelete}
          onShowOnMap={showOnMap}
        />
      )}
    </div>
  );
}
