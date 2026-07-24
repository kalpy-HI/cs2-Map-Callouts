import { useMemo, useState } from 'react';
import { maps, getMapById } from './data/maps';
import MapSelector from './components/MapSelector';
import MapViewer from './components/MapViewer';
import CalloutPanel from './components/CalloutPanel';

export default function App() {
  const [selectedId, setSelectedId] = useState(maps[0].id);
  const [query, setQuery] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(false);

  const map = getMapById(selectedId) ?? maps[0];

  // 依搜尋字串過濾報點（比對中文與英文名，忽略大小寫）。
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return map.callouts;
    return map.callouts.filter(
      (c) =>
        c.nameZh.toLowerCase().includes(q) ||
        (c.nameEn?.toLowerCase().includes(q) ?? false),
    );
  }, [map, query]);

  // 有搜尋字串時，地圖上只保留符合的報點（其餘淡化）。
  const visibleIds = useMemo(
    () => (query.trim() ? new Set(filtered.map((c) => c.id)) : null),
    [query, filtered],
  );

  // 切換地圖時清空 hover 與搜尋，避免殘留高亮。
  const handleSelect = (id: string) => {
    setSelectedId(id);
    setHoveredId(null);
    setQuery('');
  };

  return (
    <div className="app">
      <header className="app-header">
        <span className="logo">
          CS2 <span className="accent">中文報點</span>
        </span>
        <span className="tagline">快速查詢 · 切換地圖 · 立即報點</span>
        <span className="spacer" />
        <label className="toggle">
          <input
            type="checkbox"
            checked={showLabels}
            onChange={(e) => setShowLabels(e.target.checked)}
          />
          <span>顯示報點名稱</span>
        </label>
        <a
          href="https://github.com/kalpy-hi/cs2-map-callouts"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </header>

      <MapSelector maps={maps} selectedId={selectedId} onSelect={handleSelect} />

      <MapViewer
        map={map}
        highlightId={hoveredId}
        visibleIds={visibleIds}
        onHover={setHoveredId}
        showAllLabels={showLabels}
      />

      <CalloutPanel
        callouts={map.callouts}
        query={query}
        onQueryChange={setQuery}
        filtered={filtered}
        highlightId={hoveredId}
        onHover={setHoveredId}
      />
    </div>
  );
}
