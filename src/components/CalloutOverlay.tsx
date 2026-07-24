import type { Callout } from '../types';
import { labelPosition, toPointsAttr, DEFAULT_RADIUS } from '../utils/geometry';

interface Props {
  callouts: Callout[];
  /** 目前高亮的報點 id（來自 hover 或搜尋） */
  highlightId: string | null;
  /** 搜尋過濾後仍符合的報點 id 集合；null 代表未過濾（全部顯示） */
  visibleIds: Set<string> | null;
  onHover: (id: string | null) => void;
}

/** 疊在雷達圖上的 SVG 報點層：hover 高亮並顯示中文標籤。
    支援面狀（polygon）與點狀（circle）兩種報點。 */
export default function CalloutOverlay({ callouts, highlightId, visibleIds, onHover }: Props) {
  return (
    <svg className="overlay" viewBox="0 0 1 1" preserveAspectRatio="none">
      {callouts.map((c) => {
        const dimmed = visibleIds !== null && !visibleIds.has(c.id);
        const highlight = c.id === highlightId;
        const common = {
          className: highlight ? 'highlight' : undefined,
          style: dimmed ? { opacity: 0.12, pointerEvents: 'none' as const } : undefined,
          onMouseEnter: () => onHover(c.id),
          onMouseLeave: () => onHover(null),
        };
        const titleText = `${c.nameZh}${c.nameEn ? `（${c.nameEn}）` : ''}`;
        if (c.point) {
          const [cx, cy] = c.point;
          return (
            <circle key={c.id} cx={cx} cy={cy} r={c.radius ?? DEFAULT_RADIUS} {...common}>
              <title>{titleText}</title>
            </circle>
          );
        }
        return (
          <polygon key={c.id} points={toPointsAttr(c.points ?? [])} {...common}>
            <title>{titleText}</title>
          </polygon>
        );
      })}
      {callouts.map((c) => {
        const [lx, ly] = labelPosition(c);
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
