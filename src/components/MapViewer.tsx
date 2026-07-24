import type { MapData } from '../types';
import CalloutOverlay from './CalloutOverlay';

interface Props {
  map: MapData;
  highlightId: string | null;
  visibleIds: Set<string> | null;
  onHover: (id: string | null) => void;
}

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

/** 中央地圖檢視：雷達圖 + 報點疊層。 */
export default function MapViewer({ map, highlightId, visibleIds, onHover }: Props) {
  return (
    <main className="viewer">
      <div className="map-stage">
        <img src={asset(map.radarImage)} alt={`${map.nameZh} 雷達圖`} />
        {map.callouts.length > 0 ? (
          <CalloutOverlay
            callouts={map.callouts}
            highlightId={highlightId}
            visibleIds={visibleIds}
            onHover={onHover}
          />
        ) : (
          <div className="empty-hint">
            此地圖報點資料待補
            <br />
            （在 src/data/maps.ts 補上 callouts 即可）
          </div>
        )}
      </div>
    </main>
  );
}
