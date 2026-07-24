// 幾何小工具：報點多邊形相關計算（座標皆為 0..1 正規化）。

import type { Callout } from '../types';

/** 計算多邊形質心，作為標籤預設位置。 */
export function centroid(points: [number, number][]): [number, number] {
  const n = points.length;
  if (n === 0) return [0.5, 0.5];
  let x = 0;
  let y = 0;
  for (const [px, py] of points) {
    x += px;
    y += py;
  }
  return [x / n, y / n];
}

/** 取得報點的標籤位置：labelPos → point → 多邊形質心。 */
export function labelPosition(c: Callout): [number, number] {
  if (c.labelPos) return c.labelPos;
  if (c.point) return c.point;
  if (c.points && c.points.length) return centroid(c.points);
  return [0.5, 0.5];
}

/** 點狀報點的預設半徑。 */
export const DEFAULT_RADIUS = 0.026;

/** 將多邊形頂點轉為 SVG points 屬性字串。 */
export function toPointsAttr(points: [number, number][]): string {
  return points.map(([x, y]) => `${x},${y}`).join(' ');
}
