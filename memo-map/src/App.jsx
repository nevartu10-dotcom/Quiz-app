import { useState } from 'react';
import { useMemos } from './hooks/useMemos';
import { useGeolocation } from './hooks/useGeolocation';
import { useOnline } from './hooks/useOnline';
import MapPage from './pages/MapPage';
import ListPage from './pages/ListPage';
import MemoEditor from './components/MemoEditor';
import TabBar from './components/TabBar';

export default function App() {
  const { memos, addMemo, updateMemo, deleteMemo } = useMemos();
  const { position, error: geoError } = useGeolocation();
  const online = useOnline();
  const [tab, setTab] = useState('map');
  const [focusedId, setFocusedId] = useState(null);
  const [mapView, setMapView] = useState(null);
  // { memo?, location } while the editor sheet is open
  const [editor, setEditor] = useState(null);

  function openNew(location) {
    setEditor({ location });
  }

  function openEdit(memo) {
    setEditor({ memo, location: memo.location });
  }

  function handleSave({ text, source }) {
    if (editor.memo) {
      updateMemo(editor.memo.id, { text });
    } else {
      const memo = addMemo({ text, source, location: editor.location });
      setFocusedId(memo.id);
    }
    setEditor(null);
  }

  function handleDelete(id) {
    if (!window.confirm('Delete this memo?')) return;
    deleteMemo(id);
    if (focusedId === id) setFocusedId(null);
    setEditor(null);
  }

  function showOnMap(memo) {
    setFocusedId(memo.id);
    setMapView({ center: memo.location, zoom: 16 });
    setTab('map');
  }

  return (
    <div className="flex h-full flex-col">
      <main className="relative min-h-0 flex-1">
        {tab === 'map' ? (
          <MapPage
            memos={memos}
            position={position}
            geoError={geoError}
            online={online}
            focusedId={focusedId}
            view={mapView}
            onViewChange={setMapView}
            onAddAt={openNew}
            onEdit={openEdit}
          />
        ) : (
          <ListPage memos={memos} position={position} onShowOnMap={showOnMap} onEdit={openEdit} />
        )}
      </main>
      <TabBar
        active={tab}
        onChange={(next) => {
          setFocusedId(null);
          setTab(next);
        }}
        count={memos.length}
      />

      {editor && (
        <MemoEditor
          key={editor.memo?.id ?? 'new'}
          memo={editor.memo}
          location={editor.location}
          onSave={handleSave}
          onCancel={() => setEditor(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
