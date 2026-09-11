import type { TacticTool } from '../types';
import { TACTIC_COLORS, TEAM_COLORS } from '../tactics';

export interface ArmedMarker {
  team: 'ct' | 't';
  label: string;
}

interface Props {
  tool: TacticTool;
  onToolChange: (t: TacticTool) => void;
  color: string;
  onColorChange: (c: string) => void;
  armed: ArmedMarker | null;
  onArm: (m: ArmedMarker | null) => void;
  onUndo: () => void;
  canUndo: boolean;
  onClear: () => void;
  isEmpty: boolean;
}

const TOOLS: { id: TacticTool; icon: string; label: string }[] = [
  { id: 'none', icon: '✋', label: '檢視／移動' },
  { id: 'pen', icon: '✏️', label: '畫筆' },
  { id: 'arrow', icon: '↗', label: '箭頭' },
  { id: 'eraser', icon: '🧽', label: '橡皮擦' },
];

/** 戰術板工具列：工具、顏色、人員站位、復原／清除。 */
export default function TacticsToolbar({
  tool,
  onToolChange,
  color,
  onColorChange,
  armed,
  onArm,
  onUndo,
  canUndo,
  onClear,
  isEmpty,
}: Props) {
  return (
    <div className="tactics-toolbar">
      <div className="tt-group" role="group" aria-label="工具">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            className={tool === t.id ? 'active' : undefined}
            title={t.label}
            aria-label={t.label}
            aria-pressed={tool === t.id}
            onClick={() => {
              onToolChange(t.id);
              onArm(null);
            }}
          >
            {t.icon}
          </button>
        ))}
      </div>

      <div className="tt-group tt-colors" role="group" aria-label="顏色">
        {TACTIC_COLORS.map((c) => (
          <button
            key={c}
            className={`swatch${color === c ? ' active' : ''}`}
            style={{ background: c }}
            title={`顏色 ${c}`}
            aria-label={`顏色 ${c}`}
            aria-pressed={color === c}
            onClick={() => onColorChange(c)}
          />
        ))}
      </div>

      <div className="tt-group tt-roster" role="group" aria-label="人員站位">
        {(['ct', 't'] as const).map((team) =>
          ['1', '2', '3', '4', '5'].map((n) => {
            const on = armed?.team === team && armed?.label === n;
            return (
              <button
                key={`${team}${n}`}
                className={`pawn${on ? ' active' : ''}`}
                style={{ background: TEAM_COLORS[team] }}
                title={`${team === 'ct' ? 'CT' : 'T'} ${n}（點我後再點地圖放置）`}
                aria-pressed={on}
                onClick={() => {
                  onArm(on ? null : { team, label: n });
                  onToolChange('none');
                }}
              >
                {n}
              </button>
            );
          }),
        )}
      </div>

      <div className="tt-group">
        <button onClick={onUndo} disabled={!canUndo} title="復原" aria-label="復原">
          ↶
        </button>
        <button onClick={onClear} disabled={isEmpty} title="清除全部" aria-label="清除全部">
          🗑
        </button>
      </div>

      {armed && <span className="tt-hint">點地圖放置 {armed.team === 'ct' ? 'CT' : 'T'} {armed.label}</span>}
    </div>
  );
}
