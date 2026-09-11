// 報點區域：以正規化 0..1 座標描述，與地圖圖片同一座標系。
// 支援兩種形狀，擇一使用：
//   - 面狀區域：提供 points（多邊形頂點）
//   - 點狀熱點：提供 point（中心）＋可選 radius（半徑，預設 0.03）
export interface Callout {
  /** 唯一 id（同一張圖內不重複） */
  id: string;
  /** 中文報點名稱，例如「A大」「窗戶」「中路」 */
  nameZh: string;
  /** 英文對照名稱（可選） */
  nameEn?: string;
  /** 多邊形頂點，皆為 0..1 正規化座標 [x, y]（面狀區域用） */
  points?: [number, number][];
  /** 熱點中心 [x, y]，0..1 正規化（點狀報點用） */
  point?: [number, number];
  /** 熱點半徑，0..1 正規化，預設 0.03（僅 point 時有效；圓形） */
  radius?: number;
  /** 橢圓熱點的水平半徑（0..1）；與 ry 搭配可貼合實際區域的長寬比例 */
  rx?: number;
  /** 橢圓熱點的垂直半徑（0..1） */
  ry?: number;
  /** 文字標籤位置（可選）；未提供時取 point 或多邊形質心 */
  labelPos?: [number, number];
}

// ── 戰術板 ──────────────────────────────────────────────
/** 目前使用的戰術工具；'none' 為一般檢視（可平移、hover 報點）。 */
export type TacticTool = 'none' | 'pen' | 'arrow' | 'eraser';

/** 一筆手繪線條或箭頭；points 為 0..1 正規化座標，隨地圖縮放平移。 */
export interface TacticStroke {
  id: string;
  kind: 'pen' | 'arrow';
  color: string;
  /** 線寬（螢幕像素，用 non-scaling-stroke 維持視覺粗細一致） */
  width: number;
  points: [number, number][];
}

/** 地圖上的人員站位標記。 */
export interface TacticMarker {
  id: string;
  team: 'ct' | 't';
  /** 顯示的號碼，例如 "1"～"5" */
  label: string;
  point: [number, number];
}

/** 單一地圖（單一樓層）的戰術內容。 */
export interface TacticsData {
  strokes: TacticStroke[];
  markers: TacticMarker[];
}

/** 多層地圖的單一樓層（例如 Nuke 的上層／下層）。 */
export interface MapLevel {
  /** 樓層 id，例如 "default" / "lower" */
  id: string;
  /** 樓層顯示名稱，例如 "上層" */
  nameZh: string;
  /** 該樓層的雷達圖路徑（相對 public/） */
  radarImage: string;
  /** 該樓層的報點清單 */
  callouts: Callout[];
}

export interface MapData {
  /** 唯一 id，例如 "mirage" */
  id: string;
  /** 英文地圖名，例如 "Mirage" */
  nameEn: string;
  /** 中文地圖名，例如 "荒漠迷城" */
  nameZh: string;
  /** 官方地圖小圖示路徑（相對 public/），用於左側選單 */
  icon?: string;
  /** 雷達圖路徑（相對 public/）；多層地圖時作為預設樓層 */
  radarImage: string;
  /** 是否為現役地圖池 */
  active: boolean;
  /** 該地圖的報點清單；尚未建立資料時為空陣列 */
  callouts: Callout[];
  /** 多層地圖的樓層清單（如 Nuke）；有值時以樓層的圖與報點為準 */
  levels?: MapLevel[];
}
