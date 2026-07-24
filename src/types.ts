// 報點區域：以正規化 0..1 座標描述，與地圖圖片同一座標系。
export interface Callout {
  /** 唯一 id（同一張圖內不重複） */
  id: string;
  /** 中文報點名稱，例如「A大」「窗」「中路」 */
  nameZh: string;
  /** 英文對照名稱，例如 "Palace"、"Window"、"Mid"（可選） */
  nameEn?: string;
  /** 多邊形頂點，皆為 0..1 正規化座標 [x, y] */
  points: [number, number][];
  /** 文字標籤位置（可選）；未提供時以多邊形質心自動計算 */
  labelPos?: [number, number];
}

export interface MapData {
  /** 唯一 id，例如 "mirage" */
  id: string;
  /** 英文地圖名，例如 "Mirage" */
  nameEn: string;
  /** 中文地圖名，例如 "沙漠2號" */
  nameZh: string;
  /** 雷達圖路徑（相對 public/），例如 "maps/mirage.svg" */
  radarImage: string;
  /** 是否為現役地圖池 */
  active: boolean;
  /** 該地圖的報點清單；尚未建立資料時為空陣列 */
  callouts: Callout[];
}
