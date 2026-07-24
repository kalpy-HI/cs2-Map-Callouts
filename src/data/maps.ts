import type { MapData } from '../types';

// ─────────────────────────────────────────────────────────────
// 單一資料來源：新增地圖或報點只要改這個檔案（並把雷達圖放進 public/maps/）。
//
// 座標系統：所有 point / points / labelPos 皆為 0..1 正規化座標，
// 相對「雷達圖檔案本身」的寬高，原點在左上角，x 向右、y 向下。
// 疊層與圖片以相同方式拉伸填滿，因此座標與圖片永遠對齊。
//
// 報點形狀二擇一：
//   - 點狀：point:[x,y]（＋可選 radius，預設 0.026）── 大多數報點用這個
//   - 面狀：points:[[x,y],…] 多邊形 ── 較大的區域可用
//
// Mirage、Dust II 使用真實 minimap 底圖（public/maps/*.webp、*.png），
// 報點座標以座標格校準後對齊到底圖地形。
// ─────────────────────────────────────────────────────────────

export const maps: MapData[] = [
  {
    id: 'mirage',
    nameEn: 'Mirage',
    nameZh: '荒漠迷城',
    radarImage: 'maps/mirage.webp',
    active: true,
    callouts: [
      { id: 'b-white-car', nameZh: '白車', nameEn: 'White Car', point: [0.155, 0.19] },
      { id: 'b-second-floor', nameZh: 'B二樓', nameEn: 'B Balcony', point: [0.245, 0.18], radius: 0.035 },
      { id: 'sofa-wall', nameZh: '沙發貼牆位', point: [0.115, 0.26] },
      { id: 'ninja', nameZh: '二樓包位／忍者位', point: [0.225, 0.24] },
      { id: 'pillar', nameZh: '柱子', nameEn: 'Pillar', point: [0.305, 0.26] },
      { id: 'sofa', nameZh: '沙發', nameEn: 'Sofa', point: [0.125, 0.3] },
      { id: 'b-small-plant', nameZh: 'B小包位', point: [0.275, 0.29] },
      { id: 'b-safe', nameZh: '安全包位', point: [0.205, 0.315] },
      { id: 'b-site', nameZh: 'B點', nameEn: 'B Site', point: [0.265, 0.28], radius: 0.045 },
      { id: 'e-box', nameZh: 'E箱', point: [0.325, 0.34] },
      { id: 'window', nameZh: '窗戶', nameEn: 'Window', point: [0.255, 0.38] },
      { id: 'market', nameZh: '超市', nameEn: 'Market', point: [0.225, 0.44], radius: 0.035 },
      { id: 'kitchen', nameZh: '廚房', nameEn: 'Kitchen', point: [0.425, 0.21], radius: 0.03 },
      { id: 'sewer-stairs', nameZh: '下水道樓梯', point: [0.505, 0.23] },
      { id: 'b-connector', nameZh: 'B連接', nameEn: 'B Connector', point: [0.465, 0.3], radius: 0.03 },
      { id: 'dark-room', nameZh: '小黑屋', point: [0.425, 0.34] },
      { id: 'b-short', nameZh: 'B小', nameEn: 'B Short', point: [0.485, 0.33], radius: 0.03 },
      { id: 'sewer', nameZh: '下水道', nameEn: 'Underpass', point: [0.445, 0.4] },
      { id: 'vip', nameZh: 'VIP', point: [0.405, 0.45], radius: 0.03 },
      { id: 'mid', nameZh: '中路', nameEn: 'Mid', point: [0.525, 0.44], radius: 0.045 },
      { id: 'mid-far', nameZh: '中遠', point: [0.645, 0.4], radius: 0.03 },
      { id: 'sandbag-car', nameZh: '沙袋／草車', point: [0.655, 0.47], radius: 0.03 },
      { id: 'l-spot', nameZh: 'L位', nameEn: 'L', point: [0.575, 0.52] },
      { id: 'arch', nameZh: '拱門', nameEn: 'Arch', point: [0.505, 0.55] },
      { id: 't-second-floor', nameZh: '匪二樓', point: [0.625, 0.18], radius: 0.035 },
      { id: 't-spawn', nameZh: '匪家（T出生點）', nameEn: 'T Spawn', point: [0.885, 0.36], radius: 0.045 },
      { id: 'jungle', nameZh: 'Jungle', point: [0.425, 0.6], radius: 0.035 },
      { id: 'sandwich', nameZh: '三明治', point: [0.555, 0.62] },
      { id: 'a1-box', nameZh: 'A1箱', point: [0.625, 0.6] },
      { id: 'jump', nameZh: '跳台', point: [0.535, 0.63] },
      { id: 'a1', nameZh: 'A1', point: [0.725, 0.62], radius: 0.03 },
      { id: 'roof-edge', nameZh: '房沿', point: [0.805, 0.62] },
      { id: 'ct-spawn', nameZh: '警家（CT出生點）', nameEn: 'CT Spawn', point: [0.325, 0.68], radius: 0.04 },
      { id: 'long-box', nameZh: '長箱', point: [0.495, 0.73] },
      { id: 'short-box', nameZh: '短箱', point: [0.575, 0.73] },
      { id: 'a-site', nameZh: 'A點', nameEn: 'A Site', point: [0.545, 0.77], radius: 0.045 },
      { id: 'a2', nameZh: 'A2', point: [0.745, 0.77], radius: 0.035 },
      { id: 'trash', nameZh: '垃圾桶', point: [0.405, 0.75] },
      { id: 'stairs-dead', nameZh: '死點', point: [0.595, 0.78] },
      { id: 'ninja-a', nameZh: '陰人位／忍者位', point: [0.515, 0.805] },
      { id: 'ticket', nameZh: '售票亭', point: [0.445, 0.83] },
    ],
  },
  {
    id: 'dust2',
    nameEn: 'Dust II',
    nameZh: '炙熱沙城 II',
    radarImage: 'maps/dust2.png',
    active: true,
    callouts: [
      { id: 'sniper', nameZh: '狙位', nameEn: 'Sniper', point: [0.06, 0.06] },
      { id: 'b-site', nameZh: 'B點', nameEn: 'B Site', point: [0.15, 0.12], radius: 0.045 },
      { id: 'b-platform', nameZh: 'B台', nameEn: 'B Platform', point: [0.11, 0.16], radius: 0.035 },
      { id: 'b-corner', nameZh: '包點死角', point: [0.205, 0.09] },
      { id: 'double-box', nameZh: '雙箱', point: [0.165, 0.13] },
      { id: 'dog-hole', nameZh: '狗洞', point: [0.215, 0.155] },
      { id: 'big-box', nameZh: '大箱', point: [0.1, 0.21] },
      { id: 'fake-door', nameZh: '假門', point: [0.035, 0.24] },
      { id: 'b-door', nameZh: 'B門', point: [0.19, 0.225] },
      { id: 'b-door-box', nameZh: 'B門箱子', point: [0.225, 0.26] },
      { id: 'dog-spot', nameZh: '狗位', point: [0.035, 0.31] },
      { id: 'b-car-left', nameZh: '車位', point: [0.14, 0.33] },
      { id: 'b-hole', nameZh: 'B洞', point: [0.05, 0.38] },
      { id: 'b1', nameZh: 'B1', point: [0.31, 0.4] },
      { id: 'b2', nameZh: 'B2', point: [0.06, 0.47] },
      { id: 'b-ramp', nameZh: 'B斜坡', point: [0.3, 0.215], radius: 0.035 },
      { id: 'ct-mid', nameZh: '警中', point: [0.42, 0.24], radius: 0.03 },
      { id: 'mid-door', nameZh: '中門', nameEn: 'Mid Doors', point: [0.45, 0.35] },
      { id: 'x-box', nameZh: 'x箱', point: [0.47, 0.4] },
      { id: 'mid', nameZh: '中路', nameEn: 'Mid', point: [0.46, 0.48], radius: 0.045 },
      { id: 'l-spot', nameZh: 'L位', nameEn: 'L', point: [0.37, 0.63] },
      { id: 'mid-far', nameZh: '中遠', point: [0.46, 0.62] },
      { id: 'tunnel-dark', nameZh: '暗道', point: [0.45, 0.75] },
      { id: 'ninja', nameZh: '忍者位', point: [0.665, 0.125] },
      { id: 'goose', nameZh: 'goose位', nameEn: 'Goose', point: [0.815, 0.045] },
      { id: 'oil-drum', nameZh: '油桶', point: [0.85, 0.07] },
      { id: 'a-platform', nameZh: 'A平台', point: [0.735, 0.145] },
      { id: 'a-ramp-top', nameZh: '斜坡', point: [0.875, 0.14], radius: 0.03 },
      { id: 'a-site', nameZh: 'A點', nameEn: 'A Site', point: [0.83, 0.17], radius: 0.045 },
      { id: 'ct-spawn', nameZh: '警家（CT出生點）', nameEn: 'CT Spawn', point: [0.6, 0.18], radius: 0.04 },
      { id: 'elevator', nameZh: '電梯位', point: [0.735, 0.205] },
      { id: 'car-right', nameZh: '車位', point: [0.9, 0.27] },
      { id: 'a-short-stairs', nameZh: 'A小樓梯', point: [0.62, 0.33] },
      { id: 'a-long', nameZh: 'A大', nameEn: 'Long A', point: [0.875, 0.4], radius: 0.045 },
      { id: 'a-short', nameZh: 'A小', nameEn: 'A Short', point: [0.58, 0.4], radius: 0.03 },
      { id: 'blue-box', nameZh: '藍箱', point: [0.73, 0.46] },
      { id: 'a-door-up', nameZh: 'A門（上）', point: [0.7, 0.55] },
      { id: 'a-door-down', nameZh: 'A門（下）', point: [0.7, 0.66] },
      { id: 'a-pit-platform', nameZh: 'A坑平台', point: [0.815, 0.6] },
      { id: 'a-pit', nameZh: 'A坑（pit）', nameEn: 'Pit', point: [0.905, 0.635], radius: 0.03 },
      { id: 'yellow-car', nameZh: '黃車', point: [0.68, 0.75] },
      { id: 'garden', nameZh: '後花園', point: [0.13, 0.68], radius: 0.035 },
      { id: 'garden-ramp', nameZh: '斜坡', point: [0.1, 0.82] },
      { id: 'garden-platform', nameZh: '後花園平台', point: [0.2, 0.83], radius: 0.035 },
      { id: 't-spawn', nameZh: '匪家（T出生點）', nameEn: 'T Spawn', point: [0.36, 0.9], radius: 0.045 },
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
