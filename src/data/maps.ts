import type { MapData } from '../types';

// ─────────────────────────────────────────────────────────────
// 單一資料來源：新增地圖或報點只要改這個檔案（並把雷達圖放進 public/maps/）。
//
// 座標系統：所有 point / points / labelPos 皆為 0..1 正規化座標，
// 原點在雷達圖左上角，x 向右、y 向下。這樣不論圖片實際尺寸多大，疊層都能對齊。
//
// 報點形狀二擇一：
//   - 點狀：point:[x,y]（＋可選 radius，預設 0.026）── 大多數報點用這個
//   - 面狀：points:[[x,y],…] 多邊形 ── 較大的區域可用
//
// 雷達圖為 public/maps/*.svg，是依中文報點圖「重新手繪的原創示意圖」（非遊戲原始素材）。
// ─────────────────────────────────────────────────────────────

export const maps: MapData[] = [
  {
    id: 'mirage',
    nameEn: 'Mirage',
    nameZh: '荒漠迷城',
    radarImage: 'maps/mirage.svg',
    active: true,
    callouts: [
      // ── B 區（左上） ──
      { id: 'b-white-car', nameZh: '白車', nameEn: 'White Car', point: [0.18, 0.19] },
      { id: 'b-second-floor', nameZh: 'B二樓', nameEn: 'B Balcony', point: [0.31, 0.185], radius: 0.045 },
      { id: 'sofa-wall', nameZh: '沙發貼牆位', point: [0.115, 0.235] },
      { id: 'ninja', nameZh: '二樓包位／忍者位', point: [0.255, 0.245] },
      { id: 'pillar', nameZh: '柱子', nameEn: 'Pillar', point: [0.335, 0.255] },
      { id: 'sofa', nameZh: '沙發', nameEn: 'Sofa', point: [0.12, 0.278] },
      { id: 'b-small-plant', nameZh: 'B小包位', point: [0.285, 0.288] },
      { id: 'b-safe', nameZh: '安全包位', point: [0.2, 0.318] },
      { id: 'b-site', nameZh: 'B點', nameEn: 'B Site', point: [0.225, 0.3], radius: 0.05 },
      { id: 'e-box', nameZh: 'E箱', point: [0.325, 0.35] },
      { id: 'window', nameZh: '窗戶', nameEn: 'Window', point: [0.25, 0.375] },
      { id: 'market', nameZh: '超市', nameEn: 'Market', point: [0.225, 0.44], radius: 0.04 },
      // ── 中路 / 連接 ──
      { id: 'kitchen', nameZh: '廚房', nameEn: 'Kitchen', point: [0.405, 0.235], radius: 0.035 },
      { id: 'sewer-stairs', nameZh: '下水道樓梯', point: [0.51, 0.245] },
      { id: 'b-connector', nameZh: 'B連接', nameEn: 'B Connector', point: [0.43, 0.298], radius: 0.035 },
      { id: 'dark-room', nameZh: '小黑屋', point: [0.408, 0.35] },
      { id: 'b-short', nameZh: 'B小', nameEn: 'B Short', point: [0.47, 0.345], radius: 0.035 },
      { id: 'sewer', nameZh: '下水道', nameEn: 'Underpass', point: [0.415, 0.4] },
      { id: 'vip', nameZh: 'VIP', point: [0.385, 0.44], radius: 0.035 },
      { id: 'mid', nameZh: '中路', nameEn: 'Mid', point: [0.52, 0.44], radius: 0.05 },
      { id: 'mid-far', nameZh: '中遠', point: [0.66, 0.405], radius: 0.035 },
      { id: 'sandbag-car', nameZh: '沙袋／草車', point: [0.66, 0.455], radius: 0.035 },
      { id: 'l-spot', nameZh: 'L位', nameEn: 'L', point: [0.565, 0.495] },
      { id: 'arch', nameZh: '拱門', nameEn: 'Arch', point: [0.49, 0.53] },
      // ── 匪方 / 頂部 ──
      { id: 't-second-floor', nameZh: '匪二樓', point: [0.62, 0.17], radius: 0.045 },
      { id: 't-spawn', nameZh: '匪家（T出生點）', nameEn: 'T Spawn', point: [0.85, 0.35], radius: 0.05 },
      // ── A 區 / 下半 ──
      { id: 'jungle', nameZh: 'Jungle', point: [0.4, 0.61], radius: 0.04 },
      { id: 'sandwich', nameZh: '三明治', point: [0.55, 0.62] },
      { id: 'a1-box', nameZh: 'A1箱', point: [0.605, 0.595] },
      { id: 'jump', nameZh: '跳台', point: [0.515, 0.628] },
      { id: 'a1', nameZh: 'A1', point: [0.72, 0.628], radius: 0.035 },
      { id: 'roof-edge', nameZh: '房沿', point: [0.765, 0.615] },
      { id: 'ct-spawn', nameZh: '警家（CT出生點）', nameEn: 'CT Spawn', point: [0.285, 0.685], radius: 0.05 },
      { id: 'long-box', nameZh: '長箱', point: [0.485, 0.723] },
      { id: 'short-box', nameZh: '短箱', point: [0.565, 0.723] },
      { id: 'a-site', nameZh: 'A點', nameEn: 'A Site', point: [0.525, 0.75], radius: 0.05 },
      { id: 'a2', nameZh: 'A2', point: [0.715, 0.755], radius: 0.04 },
      { id: 'trash', nameZh: '垃圾桶', point: [0.4, 0.76] },
      { id: 'stairs-dead', nameZh: '死點', point: [0.58, 0.775] },
      { id: 'ninja-a', nameZh: '陰人位／忍者位', point: [0.5, 0.795] },
      { id: 'ticket', nameZh: '售票亭', point: [0.42, 0.815] },
    ],
  },
  {
    id: 'dust2',
    nameEn: 'Dust II',
    nameZh: '炙熱沙城 II',
    radarImage: 'maps/dust2.svg',
    active: true,
    callouts: [
      // ── B 區（左上） ──
      { id: 'sniper', nameZh: '狙位', nameEn: 'Sniper', point: [0.1, 0.058] },
      { id: 'b-platform', nameZh: 'B台', nameEn: 'B Platform', point: [0.1, 0.13], radius: 0.04 },
      { id: 'b-corner', nameZh: '包點死角', point: [0.225, 0.1] },
      { id: 'double-box', nameZh: '雙箱', point: [0.19, 0.14] },
      { id: 'dog-hole', nameZh: '狗洞', point: [0.255, 0.13] },
      { id: 'b-site', nameZh: 'B點', nameEn: 'B Site', point: [0.215, 0.16], radius: 0.045 },
      { id: 'big-box', nameZh: '大箱', point: [0.145, 0.205] },
      { id: 'fake-door', nameZh: '假門', point: [0.075, 0.235] },
      { id: 'b-door', nameZh: 'B門', point: [0.265, 0.235] },
      { id: 'b-door-box', nameZh: 'B門箱子', point: [0.265, 0.268] },
      { id: 'dog-spot', nameZh: '狗位', point: [0.06, 0.3] },
      { id: 'b-car-left', nameZh: '車位', point: [0.185, 0.325] },
      { id: 'b-hole', nameZh: 'B洞', point: [0.11, 0.365] },
      { id: 'b1', nameZh: 'B1', point: [0.355, 0.405] },
      { id: 'b2', nameZh: 'B2', point: [0.115, 0.465] },
      { id: 'b-ramp', nameZh: 'B斜坡', point: [0.355, 0.21], radius: 0.04 },
      // ── 中路 ──
      { id: 'ct-mid', nameZh: '警中', point: [0.44, 0.265], radius: 0.035 },
      { id: 'mid-door', nameZh: '中門', nameEn: 'Mid Doors', point: [0.455, 0.355] },
      { id: 'x-box', nameZh: 'x箱', point: [0.475, 0.405] },
      { id: 'mid', nameZh: '中路', nameEn: 'Mid', point: [0.465, 0.485], radius: 0.05 },
      { id: 'l-spot', nameZh: 'L位', nameEn: 'L', point: [0.375, 0.635] },
      { id: 'mid-far', nameZh: '中遠', point: [0.465, 0.635] },
      { id: 'tunnel-dark', nameZh: '暗道', point: [0.455, 0.735] },
      // ── A 區 / 警家（中上、右） ──
      { id: 'ninja', nameZh: '忍者位', point: [0.655, 0.115] },
      { id: 'goose', nameZh: 'goose位', nameEn: 'Goose', point: [0.79, 0.048] },
      { id: 'oil-drum', nameZh: '油桶', point: [0.87, 0.072] },
      { id: 'a-platform', nameZh: 'A平台', point: [0.735, 0.15] },
      { id: 'a-ramp-top', nameZh: '斜坡', point: [0.875, 0.155], radius: 0.035 },
      { id: 'a-site', nameZh: 'A點', nameEn: 'A Site', point: [0.8, 0.185], radius: 0.05 },
      { id: 'ct-spawn', nameZh: '警家（CT出生點）', nameEn: 'CT Spawn', point: [0.605, 0.205], radius: 0.045 },
      { id: 'elevator', nameZh: '電梯位', point: [0.735, 0.205] },
      { id: 'car-right', nameZh: '車位', point: [0.885, 0.265] },
      { id: 'a-short-stairs', nameZh: 'A小樓梯', point: [0.615, 0.35] },
      { id: 'a-long', nameZh: 'A大', nameEn: 'Long A', point: [0.855, 0.375], radius: 0.05 },
      { id: 'a-short', nameZh: 'A小', nameEn: 'A Short', point: [0.575, 0.405], radius: 0.035 },
      { id: 'blue-box', nameZh: '藍箱', point: [0.725, 0.455] },
      { id: 'a-door-up', nameZh: 'A門（上）', point: [0.685, 0.555] },
      { id: 'a-door-down', nameZh: 'A門（下）', point: [0.685, 0.655] },
      { id: 'a-pit-platform', nameZh: 'A坑平台', point: [0.915, 0.61] },
      { id: 'a-pit', nameZh: 'A坑（pit）', nameEn: 'Pit', point: [0.865, 0.655], radius: 0.035 },
      { id: 'yellow-car', nameZh: '黃車', point: [0.685, 0.745] },
      // ── 匪方 / 後花園（底部） ──
      { id: 'garden', nameZh: '後花園', point: [0.145, 0.685], radius: 0.04 },
      { id: 'garden-ramp', nameZh: '斜坡', point: [0.11, 0.815] },
      { id: 'garden-platform', nameZh: '後花園平台', point: [0.215, 0.825], radius: 0.04 },
      { id: 't-spawn', nameZh: '匪家（T出生點）', nameEn: 'T Spawn', point: [0.37, 0.885], radius: 0.05 },
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
