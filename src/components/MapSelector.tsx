import type { MapData } from '../types';

interface Props {
  maps: MapData[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

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
          <img className="thumb" src={asset(m.radarImage)} alt="" aria-hidden="true" />
          <span className="names">
            <span className="name-zh">{m.nameZh}</span>
            <span className="name-en">{m.nameEn}</span>
          </span>
          {m.callouts.length === 0 && <span className="badge">待補</span>}
        </button>
      ))}
    </nav>
  );
}
