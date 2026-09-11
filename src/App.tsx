import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { maps, getMapById } from './data/maps';
import type { TacticTool, TacticsData } from './types';
import { EMPTY_TACTICS, TACTIC_COLORS, loadTactics, saveTactics, spawnMarkers, tacticsKey } from './tactics';
import TacticsToolbar, { type ArmedMarker } from './components/TacticsToolbar';
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

  // ── 戰術板 ──
  const [tacticsOn, setTacticsOn] = useState(false);
  const [tool, setTool] = useState<TacticTool>('none');
  const [color, setColor] = useState(TACTIC_COLORS[0]);
  const [armed, setArmed] = useState<ArmedMarker | null>(null);
  const [store, setStore] = useState(() => loadTactics());
  // 每張圖（每層）各自一份復原堆疊
  const undoRef = useRef<Record<string, TacticsData[]>>({});
  const [undoTick, setUndoTick] = useState(0);

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

  const levelId = map.levels ? map.levels[Math.min(levelIdx, map.levels.length - 1)].id : 'default';
  const tKey = tacticsKey(map.id, levelId);
  // 尚未動過的地圖直接帶入雙方預設重生點；使用者清空後會寫入空物件，就不再重帶。
  const defaultMarkers = useMemo(() => spawnMarkers(map, levelIdx), [map, levelIdx]);
  const tactics = store[tKey] ?? { strokes: [], markers: defaultMarkers };

  useEffect(() => {
    saveTactics(store);
  }, [store]);

  const setTactics = useCallback(
    (next: TacticsData) => {
      setStore((prev) => {
        const cur = prev[tKey] ?? EMPTY_TACTICS;
        const stack = undoRef.current[tKey] ?? (undoRef.current[tKey] = []);
        stack.push(cur);
        if (stack.length > 50) stack.shift();
        return { ...prev, [tKey]: next };
      });
      setUndoTick((n) => n + 1);
    },
    [tKey],
  );

  const undo = useCallback(() => {
    const stack = undoRef.current[tKey];
    if (!stack?.length) return;
    const prevData = stack.pop()!;
    setStore((prev) => ({ ...prev, [tKey]: prevData }));
    setUndoTick((n) => n + 1);
  }, [tKey]);

  const canUndo = (undoRef.current[tKey]?.length ?? 0) > 0 && undoTick >= 0;
  const tacticsEmpty = tactics.strokes.length === 0 && tactics.markers.length === 0;

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
          className={`panel-toggle${tacticsOn ? ' active' : ''}`}
          onClick={() => {
            setTacticsOn((v) => !v);
            setTool('none');
            setArmed(null);
          }}
          aria-pressed={tacticsOn}
        >
          ✏️ 戰術板
        </button>
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
        tacticsOn={tacticsOn}
        tool={tool}
        color={color}
        armed={armed}
        onArm={setArmed}
        tactics={tactics}
        onTacticsChange={setTactics}
      />
      {tacticsOn && (
        <TacticsToolbar
          tool={tool}
          onToolChange={setTool}
          color={color}
          onColorChange={setColor}
          armed={armed}
          onArm={setArmed}
          onUndo={undo}
          canUndo={canUndo}
          onClear={() => setTactics(EMPTY_TACTICS)}
          isEmpty={tacticsEmpty}
          onResetSpawns={() => setTactics({ ...tactics, markers: defaultMarkers })}
          hasSpawns={defaultMarkers.length > 0}
        />
      )}

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
