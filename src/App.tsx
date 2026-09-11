import { useMemo, useState } from 'react';
import { maps, getMapById } from './data/maps';
import MapSelector from './components/MapSelector';
import MapViewer from './components/MapViewer';
import CalloutPanel from './components/CalloutPanel';

export default function App() {
  const [selectedId, setSelectedId] = useState(maps[0].id);
  const [query, setQuery] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [levelIdx, setLevelIdx] = useState(0);
  const [lang, setLang] = useState<'zh' | 'en'>('zh');

  const map = getMapById(selectedId) ?? maps[0];
  // 多層地圖（如 Nuke）以目前樓層的雷達圖與報點為準；單層地圖直接用本身的。
  const view = map.levels ? map.levels[Math.min(levelIdx, map.levels.length - 1)] : map;

  // 依搜尋字串過濾報點（比對中文與英文名，忽略大小寫）。
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return view.callouts;
    return view.callouts.filter(
      (c) =>
        c.nameZh.toLowerCase().includes(q) ||
        (c.nameEn?.toLowerCase().includes(q) ?? false),
    );
  }, [view, query]);

  // 有搜尋字串時，地圖上只保留符合的報點（其餘淡化）。
  const visibleIds = useMemo(
    () => (query.trim() ? new Set(filtered.map((c) => c.id)) : null),
    [query, filtered],
  );

  // 切換地圖時清空 hover 與搜尋，避免殘留高亮；選單維持開啟以便連續切換。
  const handleSelect = (id: string) => {
    setSelectedId(id);
    setHoveredId(null);
    setQuery('');
    setLevelIdx(0);
  };

  return (
    <div className={`app${sidebarOpen ? ' sidebar-open' : ''}${panelOpen ? ' panel-open' : ''}`}>
      <header className="app-header">
        <button
          className={`panel-toggle icon-toggle${sidebarOpen ? ' active' : ''}`}
          onClick={() => setSidebarOpen((o) => !o)}
          aria-pressed={sidebarOpen}
          aria-label="切換地圖選單"
          title="切換地圖選單"
        >
          ☰
        </button>
        <span className="logo">
          CS2 <span className="accent">中文報點</span>
        </span>
        <span className="tagline">快速查詢 · 切換地圖 · 立即報點</span>
        <span className="spacer" />
        <div className="lang-toggle" role="group" aria-label="報點語言">
          <button
            className={lang === 'zh' ? 'active' : undefined}
            onClick={() => setLang('zh')}
            aria-pressed={lang === 'zh'}
          >
            中
          </button>
          <button
            className={lang === 'en' ? 'active' : undefined}
            onClick={() => setLang('en')}
            aria-pressed={lang === 'en'}
          >
            EN
          </button>
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={showLabels}
            onChange={(e) => setShowLabels(e.target.checked)}
          />
          <span>顯示報點名稱</span>
        </label>
        <button
          className={`panel-toggle${panelOpen ? ' active' : ''}`}
          onClick={() => setPanelOpen((o) => !o)}
          aria-pressed={panelOpen}
        >
          {panelOpen ? '✕ 收合' : '🔍 搜尋報點'}
        </button>
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
        key={`${map.id}-${view.radarImage}`}
        map={map}
        radarImage={view.radarImage}
        callouts={view.callouts}
        levelIdx={levelIdx}
        onLevelChange={setLevelIdx}
        highlightId={hoveredId}
        visibleIds={visibleIds}
        onHover={setHoveredId}
        showAllLabels={showLabels}
        lang={lang}
      />

      <CalloutPanel
        callouts={view.callouts}
        query={query}
        onQueryChange={setQuery}
        filtered={filtered}
        highlightId={hoveredId}
        onHover={setHoveredId}
        lang={lang}
      />
    </div>
  );
}
