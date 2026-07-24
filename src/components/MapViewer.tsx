import { useCallback, useEffect, useRef, useState } from 'react';
import type { MapData } from '../types';
import CalloutOverlay from './CalloutOverlay';

interface Props {
  map: MapData;
  highlightId: string | null;
  visibleIds: Set<string> | null;
  onHover: (id: string | null) => void;
  showAllLabels: boolean;
}

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const MIN_ZOOM = 1;
const MAX_ZOOM = 5;

function clampPan(pos: number, stageSize: number, contentSize: number) {
  if (contentSize <= stageSize) return 0;
  return Math.min(0, Math.max(stageSize - contentSize, pos));
}

/** 中央地圖檢視：雷達圖 + 報點疊層，支援滾輪縮放與拖曳平移。 */
export default function MapViewer({ map, highlightId, visibleIds, onHover, showAllLabels }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);

  const zoomAt = useCallback((cursorX: number, cursorY: number, factor: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    const { width: stageW, height: stageH } = stage.getBoundingClientRect();
    setZoom((prevZoom) => {
      const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prevZoom * factor));
      if (newZoom === prevZoom) return prevZoom;
      setPan((prevPan) => {
        const contentX = (cursorX - prevPan.x) / prevZoom;
        const contentY = (cursorY - prevPan.y) / prevZoom;
        let nx = cursorX - contentX * newZoom;
        let ny = cursorY - contentY * newZoom;
        if (newZoom === MIN_ZOOM) {
          nx = 0;
          ny = 0;
        } else {
          nx = clampPan(nx, stageW, stageW * newZoom);
          ny = clampPan(ny, stageH, stageH * newZoom);
        }
        return { x: nx, y: ny };
      });
      return newZoom;
    });
  }, []);

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
    if (!dragRef.current || !stageRef.current) return;
    const { width: stageW, height: stageH } = stageRef.current.getBoundingClientRect();
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPan({
      x: clampPan(dragRef.current.panX + dx, stageW, stageW * zoom),
      y: clampPan(dragRef.current.panY + dy, stageH, stageH * zoom),
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
    const stage = stageRef.current;
    if (!stage) return;
    const { width, height } = stage.getBoundingClientRect();
    zoomAt(width / 2, height / 2, factor);
  };

  return (
    <main className="viewer">
      <div
        className={`map-stage${zoom > MIN_ZOOM ? ' zoomed' : ''}`}
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="map-content"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        >
          <img src={asset(map.radarImage)} alt={`${map.nameZh} 雷達圖`} draggable={false} />
          {map.callouts.length > 0 && (
            <CalloutOverlay
              callouts={map.callouts}
              highlightId={highlightId}
              visibleIds={visibleIds}
              onHover={onHover}
              showAllLabels={showAllLabels}
            />
          )}
        </div>
        {map.callouts.length === 0 && (
          <div className="empty-hint">
            此地圖報點資料待補
            <br />
            （在 src/data/maps.ts 補上 callouts 即可）
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
    </main>
  );
}
