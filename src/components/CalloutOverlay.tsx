import type { Callout } from '../types';
import { centroid, toPointsAttr } from '../utils/geometry';

interface Props {
  callouts: Callout[];
  /** 目前高亮的報點 id（來自 hover 或搜尋） */
  highlightId: string | null;
  /** 搜尋過濾後仍符合的報點 id 集合；null 代表未過濾（全部顯示） */
  visibleIds: Set<string> | null;
  onHover: (id: string | null) => void;
}

/** 疊在雷達圖上的 SVG 報點層：hover 高亮並顯示中文標籤。 */
export default function CalloutOverlay({ callouts, highlightId, visibleIds, onHover }: Props) {
  return (
    <svg className="overlay" viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="false">
      {callouts.map((c) => {
        const dimmed = visibleIds !== null && !visibleIds.has(c.id);
        const highlight = c.id === highlightId;
        return (
          <polygon
            key={c.id}
            className={highlight ? 'highlight' : undefined}
            points={toPointsAttr(c.points)}
            style={dimmed ? { opacity: 0.15, pointerEvents: 'none' } : undefined}
            onMouseEnter={() => onHover(c.id)}
            onMouseLeave={() => onHover(null)}
          >
            <title>{c.nameZh}{c.nameEn ? `（${c.nameEn}）` : ''}</title>
          </polygon>
        );
      })}
      {callouts.map((c) => {
        const [lx, ly] = c.labelPos ?? centroid(c.points);
        const show = c.id === highlightId;
        return (
          <text key={`${c.id}-label`} className={`label${show ? ' show' : ''}`} x={lx} y={ly}>
            {c.nameZh}
          </text>
        );
      })}
    </svg>
  );
}
