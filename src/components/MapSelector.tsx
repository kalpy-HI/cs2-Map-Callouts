import type { MapData } from '../types';

interface Props {
  maps: MapData[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

/** 多層地圖的報點放在 levels 裡，判斷「待補」時要一併計算。 */
const calloutCount = (m: MapData) =>
  m.levels ? m.levels.reduce((n, lv) => n + lv.callouts.length, 0) : m.callouts.length;

/** 左側現役地圖清單，點擊切換地圖。 */
export default function MapSelector({ maps, selectedId, onSelect }: Props) {
  return (
    <nav className="sidebar" aria-label="地圖選單">
      <h2>現役地圖</h2>
      {maps.map((m) => (
        <button
          key={m.id}
          className={`map-card${m.id === selectedId ? ' active' : ''}`}
          onClick={() => onSelect(m.id)}
          aria-pressed={m.id === selectedId}
        >
          <img
            className="thumb"
            src={asset(m.icon ?? m.radarImage)}
            alt=""
            aria-hidden="true"
          />
          <span className="names">
            <span className="name-zh">{m.nameZh}</span>
            <span className="name-en">{m.nameEn}</span>
          </span>
          {calloutCount(m) === 0 && <span className="badge">待補</span>}
        </button>
      ))}
    </nav>
  );
}
