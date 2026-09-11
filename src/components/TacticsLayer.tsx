import type { TacticMarker, TacticStroke, TacticTool, TacticsData } from '../types';
import { TEAM_COLORS } from '../tactics';

interface Props {
  data: TacticsData;
  /** 正在繪製中、尚未提交的線條 */
  draft: TacticStroke | null;
  tool: TacticTool;
  /** 橡皮擦點掉某個物件 */
  onErase: (kind: 'stroke' | 'marker', id: string) => void;
  /** 開始拖曳某個站位標記 */
  onMarkerPointerDown: (e: React.PointerEvent, marker: TacticMarker) => void;
  /** 標記是否可直接拖曳；畫筆／箭頭／待放置時為 false，讓事件冒泡給地圖處理 */
  markersDraggable: boolean;
}

/** 把 0..1 座標點串成 SVG path；箭頭只取頭尾兩點。 */
function toPath(s: TacticStroke) {
  const pts = s.kind === 'arrow' ? [s.points[0], s.points[s.points.length - 1]] : s.points;
  return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`).join(' ');
}

function Stroke({
  s,
  tool,
  onErase,
}: {
  s: TacticStroke;
  tool: TacticTool;
  onErase: Props['onErase'];
}) {
  const erasing = tool === 'eraser';
  return (
    <g>
      <path
        d={toPath(s)}
        fill="none"
        stroke={s.color}
        strokeWidth={s.width}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        markerEnd={s.kind === 'arrow' ? `url(#arrow-${s.color.replace('#', '')})` : undefined}
        pointerEvents="none"
      />
      {/* 橡皮擦模式下疊一條加寬的透明線，讓細線也好點到 */}
      {erasing && (
        <path
          d={toPath(s)}
          fill="none"
          stroke="transparent"
          strokeWidth={s.width + 14}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ cursor: 'pointer' }}
          onPointerDown={(e) => {
            e.stopPropagation();
            onErase('stroke', s.id);
          }}
        />
      )}
    </g>
  );
}

/** 戰術疊層：手繪線條、箭頭與人員站位。座標與報點同為 0..1，縮放平移自動跟隨。 */
export default function TacticsLayer({
  data,
  draft,
  tool,
  onErase,
  onMarkerPointerDown,
  markersDraggable,
}: Props) {
  const colors = Array.from(
    new Set([...data.strokes, ...(draft ? [draft] : [])].map((s) => s.color)),
  );
  return (
    <svg className="tactics-layer" viewBox="0 0 1 1" preserveAspectRatio="none">
      <defs>
        {colors.map((c) => (
          <marker
            key={c}
            id={`arrow-${c.replace('#', '')}`}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
            markerUnits="strokeWidth"
          >
            <path d="M0,1 L9,5 L0,9 z" fill={c} />
          </marker>
        ))}
      </defs>

      {data.strokes.map((s) => (
        <Stroke key={s.id} s={s} tool={tool} onErase={onErase} />
      ))}
      {draft && <Stroke s={draft} tool="none" onErase={onErase} />}

      {data.markers.map((m) => {
        const [x, y] = m.point;
        const fill = TEAM_COLORS[m.team];
        return (
          <g
            key={m.id}
            className="tactic-marker"
            style={{ cursor: tool === 'eraser' ? 'pointer' : markersDraggable ? 'grab' : 'inherit' }}
            onPointerDown={(e) => {
              if (tool === 'eraser') {
                e.stopPropagation();
                onErase('marker', m.id);
                return;
              }
              // 畫筆／箭頭／待放置狀態時不攔截，讓 stage 接手畫線或放置新標記
              if (!markersDraggable) return;
              e.stopPropagation();
              onMarkerPointerDown(e, m);
            }}
          >
            <ellipse cx={x} cy={y} rx={0.021} ry={0.021} fill={fill} stroke="#0008" strokeWidth={0.004} />
            <text x={x} y={y + 0.008} textAnchor="middle" fontSize={0.026} fontWeight="800" fill="#10100c">
              {m.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
