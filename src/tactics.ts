import type { TacticsData } from './types';

/** 戰術板在瀏覽器的儲存 key（依地圖＋樓層分開存）。 */
const STORAGE_KEY = 'cs2-callouts:tactics:v1';

export const EMPTY_TACTICS: TacticsData = { strokes: [], markers: [] };

/** 畫筆可選顏色。 */
export const TACTIC_COLORS = ['#ff3b30', '#ffcc00', '#34c759', '#32ade6', '#ffffff'];

/** 隊伍顏色（與 CS2 慣用色一致：CT 藍、T 黃）。 */
export const TEAM_COLORS: Record<'ct' | 't', string> = { ct: '#4aa3ff', t: '#e8b83c' };

export const newId = () => Math.random().toString(36).slice(2, 10);

/** 地圖＋樓層組成的儲存鍵值。 */
export const tacticsKey = (mapId: string, levelId: string) => `${mapId}:${levelId}`;

type Store = Record<string, TacticsData>;

/** 讀取全部戰術資料；localStorage 不可用或資料毀損時回傳空物件。 */
export function loadTactics(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Store;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

/** 寫回全部戰術資料；儲存失敗（無痕模式、配額滿）時靜默忽略。 */
export function saveTactics(store: Store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* 忽略：戰術板僅為輔助功能，存不進去不影響使用 */
  }
}
