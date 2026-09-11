import type { Callout } from '../types';

interface Props {
  callouts: Callout[];
  query: string;
  onQueryChange: (q: string) => void;
  /** 過濾後符合的報點（依搜尋字串） */
  filtered: Callout[];
  highlightId: string | null;
  onHover: (id: string | null) => void;
  lang: 'zh' | 'en';
}

/** 右側：搜尋框 + 報點清單，與地圖雙向連動。 */
export default function CalloutPanel({
  callouts,
  query,
  onQueryChange,
  filtered,
  highlightId,
  onHover,
  lang,
}: Props) {
  return (
    <aside className="callout-panel" aria-label="報點清單">
      <div className="search">
        <input
          type="search"
          placeholder="搜尋報點（中／英）…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          aria-label="搜尋報點"
        />
      </div>
      <div className="callout-list">
        {callouts.length === 0 ? (
          <p className="callout-empty">
            此地圖尚無報點資料
            <br />
            歡迎補充！
          </p>
        ) : filtered.length === 0 ? (
          <p className="callout-empty">找不到符合「{query}」的報點</p>
        ) : (
          <>
            <div className="section-title">報點（{filtered.length}）</div>
            {filtered.map((c) => (
              <div
                key={c.id}
                className={`callout-item${c.id === highlightId ? ' highlight' : ''}`}
                onMouseEnter={() => onHover(c.id)}
                onMouseLeave={() => onHover(null)}
              >
                <span className="zh">{lang === 'en' ? c.nameEn ?? c.nameZh : c.nameZh}</span>
                <span className="en">{lang === 'en' ? c.nameZh : c.nameEn}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </aside>
  );
}
