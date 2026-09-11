import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MapData } from '../types';
import CalloutOverlay from './CalloutOverlay';

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
}

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
}: Props) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [avail, setAvail] = useState<{ w: number; h: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);

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
    if (zoom <= MIN_ZOOM) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current || !base) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPan({
      x: clampPan(dragRef.current.panX + dx, base.w, base.w * zoom),
      y: clampPan(dragRef.current.panY + dy, base.h, base.h * zoom),
    });
  };
  const onPointerUp = () => {
    dragRef.current = null;
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
          className={`map-stage${zoom > MIN_ZOOM ? ' zoomed' : ''}`}
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
