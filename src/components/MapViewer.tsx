import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MapData, TacticMarker, TacticStroke, TacticTool, TacticsData } from '../types';
import CalloutOverlay from './CalloutOverlay';
import TacticsLayer from './TacticsLayer';
import type { ArmedMarker } from './TacticsToolbar';
import { newId } from '../tactics';

interface Props {
  map: MapData;
  /** 目前樓層的雷達圖（單層地圖即為地圖本身的圖） */
  radarImage: string;
  /** 目前樓層的報點 */
  callouts: MapData['callouts'];
  levelIdx: number;
  onLevelChange: (i: number) => void;
  highlightId: string | null;
  visibleIds: Set<string> | null;
  onHover: (id: string | null) => void;
  showAllLabels: boolean;
  lang: 'zh' | 'en';
  /** 戰術板：關閉時（tacticsOn=false）完全不影響原本操作 */
  tacticsOn: boolean;
  tool: TacticTool;
  color: string;
  armed: ArmedMarker | null;
  onArm: (m: ArmedMarker | null) => void;
  tactics: TacticsData;
  onTacticsChange: (d: TacticsData) => void;
}

/** 畫筆取樣：距離小於此值就不新增點，避免路徑過於密集。 */
const MIN_SAMPLE_DIST = 0.004;

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
// 對應 .viewer 的 CSS padding，計算可用尺寸時要扣除
const VIEWER_PADDING = 4;

function clampPan(pos: number, stageSize: number, contentSize: number) {
  if (contentSize <= stageSize) return 0;
  return Math.min(0, Math.max(stageSize - contentSize, pos));
}

/**
 * 中央地圖檢視：雷達圖 + 報點疊層，支援滾輪縮放與拖曳平移。
 *
 * 縮放採「實際改變版面尺寸」而非 CSS transform:scale —— transform 縮放是把
 * 已經點陣化的畫面直接拉伸，文字會跟著模糊；改成調整 .map-content 的實際
 * width/height，瀏覽器會依新尺寸重新繪製 SVG 文字，放大後仍然清晰。
 */
export default function MapViewer({
  map,
  radarImage,
  callouts,
  levelIdx,
  onLevelChange,
  highlightId,
  visibleIds,
  onHover,
  showAllLabels,
  lang,
  tacticsOn,
  tool,
  color,
  armed,
  onArm,
  tactics,
  onTacticsChange,
}: Props) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [avail, setAvail] = useState<{ w: number; h: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);
  const [draft, setDraft] = useState<TacticStroke | null>(null);
  const markerDragRef = useRef<string | null>(null);
  // 有啟用戰術工具時要接管指標事件（停用平移與報點 hover）
  const drawing = tacticsOn && tool !== 'none';
  const tacticsActive = tacticsOn && (tool !== 'none' || armed !== null);

  // 取得雷達圖原始像素尺寸（與畫面上實際渲染大小無關）。
  useEffect(() => {
    let cancelled = false;
    setNatural(null);
    const img = new Image();
    img.onload = () => {
      if (!cancelled) setNatural({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.src = asset(radarImage);
    return () => {
      cancelled = true;
    };
  }, [radarImage]);

  // 追蹤 .viewer 可用空間（視窗大小、左右欄開合都會改變）。
  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;
    const update = () => setAvail({ w: el.clientWidth - VIEWER_PADDING * 2, h: el.clientHeight - VIEWER_PADDING * 2 });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 縮放前（zoom=1）的基準尺寸：依可用空間 contain-fit 原圖比例。
  const base = useMemo(() => {
    if (!natural || !avail || avail.w <= 0 || avail.h <= 0) return null;
    const aspect = natural.w / natural.h;
    let w = avail.w;
    let h = w / aspect;
    if (h > avail.h) {
      h = avail.h;
      w = h * aspect;
    }
    return { w, h };
  }, [natural, avail]);

  const zoomAt = useCallback(
    (cursorX: number, cursorY: number, factor: number) => {
      if (!base) return;
      setZoom((prevZoom) => {
        const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prevZoom * factor));
        if (newZoom === prevZoom) return prevZoom;
        setPan((prevPan) => {
          const fracX = (cursorX - prevPan.x) / (base.w * prevZoom);
          const fracY = (cursorY - prevPan.y) / (base.h * prevZoom);
          let nx = cursorX - fracX * base.w * newZoom;
          let ny = cursorY - fracY * base.h * newZoom;
          if (newZoom === MIN_ZOOM) {
            nx = 0;
            ny = 0;
          } else {
            nx = clampPan(nx, base.w, base.w * newZoom);
            ny = clampPan(ny, base.h, base.h * newZoom);
          }
          return { x: nx, y: ny };
        });
        return newZoom;
      });
    },
    [base],
  );

  // 滾輪縮放（以滑鼠位置為中心）；需手動掛非被動監聽器才能 preventDefault。
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = stage.getBoundingClientRect();
      const factor = Math.exp(-e.deltaY * 0.0015);
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, factor);
    };
    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => stage.removeEventListener('wheel', onWheel);
  }, [zoomAt]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (tacticsOn && armed) {
      const [x, y] = toNorm(e.clientX, e.clientY);
      onTacticsChange({
        ...tactics,
        markers: [...tactics.markers, { id: newId(), team: armed.team, label: armed.label, point: [x, y] }],
      });
      onArm(null);
      return;
    }
    if (drawing) {
      if (tool === 'eraser') return; // 由各物件自行處理點擊刪除
      (e.target as Element).setPointerCapture(e.pointerId);
      const p = toNorm(e.clientX, e.clientY);
      setDraft({ id: newId(), kind: tool === 'arrow' ? 'arrow' : 'pen', color, width: 3, points: [p, p] });
      return;
    }
    if (zoom <= MIN_ZOOM) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (markerDragRef.current) {
      const [x, y] = toNorm(e.clientX, e.clientY);
      onTacticsChange({
        ...tactics,
        markers: tactics.markers.map((m) =>
          m.id === markerDragRef.current ? { ...m, point: [x, y] as [number, number] } : m,
        ),
      });
      return;
    }
    if (draft) {
      const p = toNorm(e.clientX, e.clientY);
      setDraft((d) => {
        if (!d) return d;
        if (d.kind === 'arrow') return { ...d, points: [d.points[0], p] };
        const last = d.points[d.points.length - 1];
        if (Math.hypot(p[0] - last[0], p[1] - last[1]) < MIN_SAMPLE_DIST) return d;
        return { ...d, points: [...d.points, p] };
      });
      return;
    }
    if (!dragRef.current || !base) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPan({
      x: clampPan(dragRef.current.panX + dx, base.w, base.w * zoom),
      y: clampPan(dragRef.current.panY + dy, base.h, base.h * zoom),
    });
  };
  const onPointerUp = () => {
    if (markerDragRef.current) {
      markerDragRef.current = null;
      return;
    }
    if (draft) {
      // 只有單一點的線（純點擊）不留下痕跡
      if (draft.points.length > 1) onTacticsChange({ ...tactics, strokes: [...tactics.strokes, draft] });
      setDraft(null);
      return;
    }
    dragRef.current = null;
  };

  /** 螢幕座標 → 地圖 0..1 正規化座標（已考慮縮放與平移）。 */
  const toNorm = useCallback(
    (clientX: number, clientY: number): [number, number] => {
      const r = stageRef.current!.getBoundingClientRect();
      const b = base!;
      return [
        (clientX - r.left - pan.x) / (b.w * zoom),
        (clientY - r.top - pan.y) / (b.h * zoom),
      ];
    },
    [base, pan, zoom],
  );

  const eraseItem = (kind: 'stroke' | 'marker', id: string) => {
    onTacticsChange(
      kind === 'stroke'
        ? { ...tactics, strokes: tactics.strokes.filter((s) => s.id !== id) }
        : { ...tactics, markers: tactics.markers.filter((m) => m.id !== id) },
    );
  };

  const startMarkerDrag = (e: React.PointerEvent, m: TacticMarker) => {
    if (!tacticsOn) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    markerDragRef.current = m.id;
  };

  const resetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };
  const stepZoom = (factor: number) => {
    if (!base) return;
    zoomAt(base.w / 2, base.h / 2, factor);
  };

  return (
    <main className="viewer" ref={viewerRef}>
      {base && (
        <div
          className={`map-stage${zoom > MIN_ZOOM ? ' zoomed' : ''}${
            drawing ? ' drawing' : ''
          }${tacticsActive ? ' tactics-active' : ''}`}
          ref={stageRef}
          style={{ width: base.w, height: base.h }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div
            className="map-content"
            style={{ width: base.w * zoom, height: base.h * zoom, left: pan.x, top: pan.y }}
          >
            <img src={asset(radarImage)} alt={`${map.nameZh} 雷達圖`} draggable={false} />
            {callouts.length > 0 && (
              <CalloutOverlay
                callouts={callouts}
                highlightId={highlightId}
                visibleIds={visibleIds}
                onHover={onHover}
                showAllLabels={showAllLabels}
                lang={lang}
              />
            )}
            {tacticsOn && (
              <TacticsLayer
                data={tactics}
                draft={draft}
                tool={tool}
                onErase={eraseItem}
                onMarkerPointerDown={startMarkerDrag}
                markersDraggable={tool === 'none' && !armed}
              />
            )}
          </div>
          {callouts.length === 0 && (
            <div className="empty-hint">
              此地圖報點資料待補
              <br />
              （在 src/data/maps.ts 補上 callouts 即可）
            </div>
          )}
          {map.levels && map.levels.length > 1 && (
            <div className="level-controls">
              {map.levels.map((lv, i) => (
                <button
                  key={lv.id}
                  className={i === levelIdx ? 'active' : undefined}
                  onClick={() => onLevelChange(i)}
                >
                  {lv.nameZh}
                </button>
              ))}
            </div>
          )}
          <div className="zoom-controls">
            <button onClick={() => stepZoom(1.4)} aria-label="放大">
              +
            </button>
            <button onClick={() => stepZoom(1 / 1.4)} aria-label="縮小">
              −
            </button>
            <button onClick={resetZoom} aria-label="重設縮放" className="reset">
              ⤢
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
