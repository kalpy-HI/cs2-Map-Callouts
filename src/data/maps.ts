import type { MapData } from '../types';

// ─────────────────────────────────────────────────────────────
// 單一資料來源：新增地圖或報點只要改這個檔案（並把雷達圖放進 public/maps/）。
//
// 座標系統：所有 points / labelPos 皆為 0..1 正規化座標，
// 原點在雷達圖左上角，x 向右、y 向下。
// 這樣不論圖片實際尺寸多大，疊層都能正確對齊。
//
// 骨架階段的雷達圖為 public/maps/*.svg 佔位圖；
// 之後替換成真實雷達圖後，依需要微調各報點的多邊形座標即可。
// ─────────────────────────────────────────────────────────────

export const maps: MapData[] = [
  {
    id: 'mirage',
    nameEn: 'Mirage',
    nameZh: '沙漠迷城',
    radarImage: 'maps/mirage.svg',
    active: true,
    callouts: [
      {
        id: 'a-ramp',
        nameZh: 'A大／坡道',
        nameEn: 'A Ramp',
        points: [[0.62, 0.06], [0.82, 0.06], [0.82, 0.24], [0.62, 0.24]],
      },
      {
        id: 'a-site',
        nameZh: 'A點',
        nameEn: 'A Site',
        points: [[0.66, 0.26], [0.9, 0.26], [0.9, 0.46], [0.66, 0.46]],
      },
      {
        id: 'palace',
        nameZh: '宮殿／二樓',
        nameEn: 'Palace',
        points: [[0.84, 0.06], [0.96, 0.06], [0.96, 0.24], [0.84, 0.24]],
      },
      {
        id: 'tetris',
        nameZh: '俄羅斯方塊',
        nameEn: 'Tetris',
        points: [[0.5, 0.28], [0.64, 0.28], [0.64, 0.44], [0.5, 0.44]],
      },
      {
        id: 'mid',
        nameZh: '中路',
        nameEn: 'Mid',
        points: [[0.44, 0.34], [0.6, 0.34], [0.6, 0.66], [0.44, 0.66]],
      },
      {
        id: 'window',
        nameZh: '窗',
        nameEn: 'Window',
        points: [[0.46, 0.24], [0.6, 0.24], [0.6, 0.34], [0.46, 0.34]],
      },
      {
        id: 'connector',
        nameZh: '連接／通道',
        nameEn: 'Connector',
        points: [[0.6, 0.44], [0.72, 0.44], [0.72, 0.58], [0.6, 0.58]],
      },
      {
        id: 'top-mid',
        nameZh: '中路上方',
        nameEn: 'Top Mid',
        points: [[0.44, 0.14], [0.6, 0.14], [0.6, 0.24], [0.44, 0.24]],
      },
      {
        id: 'catwalk',
        nameZh: '貓道',
        nameEn: 'Catwalk',
        points: [[0.6, 0.58], [0.72, 0.58], [0.72, 0.7], [0.6, 0.7]],
      },
      {
        id: 'b-apartments',
        nameZh: 'B公寓',
        nameEn: 'B Apartments',
        points: [[0.14, 0.1], [0.36, 0.1], [0.36, 0.34], [0.14, 0.34]],
      },
      {
        id: 'b-site',
        nameZh: 'B點',
        nameEn: 'B Site',
        points: [[0.1, 0.36], [0.34, 0.36], [0.34, 0.56], [0.1, 0.56]],
      },
      {
        id: 'ct-spawn',
        nameZh: '警家（CT出生點）',
        nameEn: 'CT Spawn',
        points: [[0.7, 0.72], [0.9, 0.72], [0.9, 0.9], [0.7, 0.9]],
      },
      {
        id: 't-spawn',
        nameZh: '匪家（T出生點）',
        nameEn: 'T Spawn',
        points: [[0.1, 0.74], [0.34, 0.74], [0.34, 0.92], [0.1, 0.92]],
      },
    ],
  },
  {
    id: 'dust2',
    nameEn: 'Dust II',
    nameZh: '炙熱沙城II',
    radarImage: 'maps/dust2.svg',
    active: true,
    callouts: [
      {
        id: 'long-a',
        nameZh: 'A長',
        nameEn: 'Long A',
        points: [[0.72, 0.18], [0.9, 0.18], [0.9, 0.62], [0.72, 0.62]],
      },
      {
        id: 'a-site',
        nameZh: 'A點',
        nameEn: 'A Site',
        points: [[0.62, 0.1], [0.84, 0.1], [0.84, 0.26], [0.62, 0.26]],
      },
      {
        id: 'a-short',
        nameZh: 'A短／貓道',
        nameEn: 'A Short / Catwalk',
        points: [[0.5, 0.24], [0.64, 0.24], [0.64, 0.4], [0.5, 0.4]],
      },
      {
        id: 'goose',
        nameZh: '鵝（A點掩體）',
        nameEn: 'Goose',
        points: [[0.64, 0.16], [0.74, 0.16], [0.74, 0.26], [0.64, 0.26]],
      },
      {
        id: 'pit',
        nameZh: '坑',
        nameEn: 'Pit',
        points: [[0.84, 0.08], [0.94, 0.08], [0.94, 0.22], [0.84, 0.22]],
      },
      {
        id: 'mid',
        nameZh: '中路',
        nameEn: 'Mid',
        points: [[0.44, 0.3], [0.58, 0.3], [0.58, 0.66], [0.44, 0.66]],
      },
      {
        id: 'mid-doors',
        nameZh: '中門',
        nameEn: 'Mid Doors',
        points: [[0.44, 0.44], [0.58, 0.44], [0.58, 0.54], [0.44, 0.54]],
      },
      {
        id: 'catwalk',
        nameZh: '貓道',
        nameEn: 'Catwalk',
        points: [[0.58, 0.36], [0.7, 0.36], [0.7, 0.5], [0.58, 0.5]],
      },
      {
        id: 'lower-tunnel',
        nameZh: '下水道',
        nameEn: 'Lower Tunnel',
        points: [[0.16, 0.5], [0.36, 0.5], [0.36, 0.66], [0.16, 0.66]],
      },
      {
        id: 'upper-tunnel',
        nameZh: '上水道',
        nameEn: 'Upper Tunnel',
        points: [[0.16, 0.34], [0.36, 0.34], [0.36, 0.5], [0.16, 0.5]],
      },
      {
        id: 'b-site',
        nameZh: 'B點',
        nameEn: 'B Site',
        points: [[0.08, 0.12], [0.32, 0.12], [0.32, 0.34], [0.08, 0.34]],
      },
      {
        id: 'b-platform',
        nameZh: 'B車（平台）',
        nameEn: 'B Platform / Car',
        points: [[0.1, 0.16], [0.2, 0.16], [0.2, 0.26], [0.1, 0.26]],
      },
      {
        id: 'ct-spawn',
        nameZh: '警家（CT出生點）',
        nameEn: 'CT Spawn',
        points: [[0.6, 0.68], [0.82, 0.68], [0.82, 0.88], [0.6, 0.88]],
      },
      {
        id: 't-spawn',
        nameZh: '匪家（T出生點）',
        nameEn: 'T Spawn',
        points: [[0.3, 0.72], [0.52, 0.72], [0.52, 0.92], [0.3, 0.92]],
      },
    ],
  },
  // ── 以下為現役圖池其餘地圖，報點資料待補 ──
  {
    id: 'inferno',
    nameEn: 'Inferno',
    nameZh: '煉獄小鎮',
    radarImage: 'maps/placeholder.svg',
    active: true,
    callouts: [],
  },
  {
    id: 'nuke',
    nameEn: 'Nuke',
    nameZh: '核子設施',
    radarImage: 'maps/placeholder.svg',
    active: true,
    callouts: [],
  },
  {
    id: 'ancient',
    nameEn: 'Ancient',
    nameZh: '遠古遺跡',
    radarImage: 'maps/placeholder.svg',
    active: true,
    callouts: [],
  },
  {
    id: 'train',
    nameEn: 'Train',
    nameZh: '列車調度場',
    radarImage: 'maps/placeholder.svg',
    active: true,
    callouts: [],
  },
  {
    id: 'anubis',
    nameEn: 'Anubis',
    nameZh: '阿努比斯',
    radarImage: 'maps/placeholder.svg',
    active: true,
    callouts: [],
  },
];

/** 依 id 取得地圖，找不到時回傳 undefined。 */
export function getMapById(id: string): MapData | undefined {
  return maps.find((m) => m.id === id);
}
