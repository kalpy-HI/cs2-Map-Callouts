import type { Callout } from '../types';
import { labelPosition, toPointsAttr, DEFAULT_RADIUS } from '../utils/geometry';

interface Props {
  callouts: Callout[];
  /** 目前高亮的報點 id（來自 hover 或搜尋） */
  highlightId: string | null;
  /** 搜尋過濾後仍符合的報點 id 集合；null 代表未過濾（全部顯示） */
  visibleIds: Set<string> | null;
  onHover: (id: string | null) => void;
  /** 是否一律顯示所有報點名稱（不必 hover） */
  showAllLabels: boolean;
  /** 標籤語言 */
  lang: 'zh' | 'en';
}

/** 依語言取得報點顯示名稱（缺英文時退回中文）。 */
export const calloutLabel = (c: Callout, lang: 'zh' | 'en') =>
  lang === 'en' ? c.nameEn ?? c.nameZh : c.nameZh;

/** 疊在雷達圖上的 SVG 報點層：hover 高亮並顯示中文標籤。
    支援面狀（polygon）與點狀（circle）兩種報點。 */
export default function CalloutOverlay({
  callouts,
  highlightId,
  visibleIds,
  onHover,
  showAllLabels,
  lang,
}: Props) {
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
          // rx/ry 為依實際區域範圍算出的橢圓；未提供時退回等半徑圓形
          const rx = c.rx ?? c.radius ?? DEFAULT_RADIUS;
          const ry = c.ry ?? c.radius ?? DEFAULT_RADIUS;
          return (
            <ellipse key={c.id} cx={cx} cy={cy} rx={rx} ry={ry} {...common}>
              <title>{titleText}</title>
            </ellipse>
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
        const dimmed = visibleIds !== null && !visibleIds.has(c.id);
        const show = !dimmed && (showAllLabels || c.id === highlightId);
        const always = showAllLabels && c.id !== highlightId;
        return (
          <text
            key={`${c.id}-label`}
            className={`label${show ? ' show' : ''}${always ? ' always' : ''}`}
            x={lx}
            y={ly}
          >
            {calloutLabel(c, lang)}
          </text>
        );
      })}
    </svg>
  );
}
