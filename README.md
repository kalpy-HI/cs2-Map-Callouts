# CS2 中文報點網站 | CS2 Map Callouts

CS2 現役地圖的**中文報點查詢網站**。在網頁上快速切換地圖、滑鼠移到區域即顯示中文報點名稱，方便遊戲中即時報點。版面參考 [valoplant.gg](https://valoplant.gg)（左側地圖切換 · 中央互動地圖 · 右側報點清單）。

**線上 demo**：https://kalpy-hi.github.io/cs2-Map-Callouts/

## 功能

- **地圖切換**：左側清單一鍵切換現役圖池地圖。
- **互動報點**：中央雷達圖疊互動層，hover 區域即高亮並顯示中文報點；與右側清單雙向連動。
- **報點搜尋**：右側搜尋框輸入中／英關鍵字即時過濾，並在地圖上定位高亮。
- **易擴充**：所有地圖與報點集中在單一資料檔，新增只需改一處。

## 開發

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 產出 dist/（可靜態部署）
npm run preview  # 本機預覽 build 結果
```

技術棧：React 18 + Vite + TypeScript。

## 專案結構

```
public/maps/           雷達圖（骨架期為 SVG 佔位圖）
src/
  types.ts             Callout / MapData 型別
  data/maps.ts         ★ 地圖與報點資料（單一資料來源）
  components/           版面與互動元件
  utils/geometry.ts    多邊形質心 / SVG 座標小工具
```

## 如何新增地圖 / 報點

編輯 **`src/data/maps.ts`** 即可，這是唯一需要動的資料檔。

1. **放入雷達圖**：把雷達圖檔（`.png`／`.jpg`／`.svg`）放到 `public/maps/`。
2. **新增或補齊 map 物件**：

   ```ts
   {
     id: 'inferno',
     nameEn: 'Inferno',
     nameZh: '煉獄小鎮',
     radarImage: 'maps/inferno.png',   // 相對 public/
     active: true,
     callouts: [
       // 點狀報點（大多數用這個）：中心 point ＋ 可選 radius
       { id: 'banana', nameZh: '香蕉道', nameEn: 'Banana', point: [0.3, 0.45] },
       // 面狀報點（較大區域）：多邊形 points
       { id: 'a-site', nameZh: 'A點', points: [[0.6, 0.2], [0.8, 0.2], [0.8, 0.4], [0.6, 0.4]] },
     ],
   }
   ```

### 座標怎麼抓

- 座標是 **0..1 正規化**：`x = 該點距左邊 / 圖片寬`、`y = 該點距上緣 / 圖片高`。與圖片實際像素尺寸無關，換圖不需重算比例（圖片與疊層以相同方式拉伸，永遠對齊）。
- 報點形狀二擇一：`point:[x,y]`（＋可選 `radius`，預設 0.026）或 `points:[[x,y],…]` 多邊形。
- `labelPos` 可省略；省略時標籤顯示在 `point` 或多邊形質心。

**校準工具**：`scripts/grid.mjs` 會把底圖疊上 0.1 座標格輸出成圖，方便直接讀出每個報點的座標；`scripts/verify.mjs` 會把 `scratch/callouts.json` 的報點畫回底圖檢查位置（需 `playwright-core`，用預裝的 Chromium）。Mirage/Dust II 的座標即以此校準對齊。

> **素材來源**：`public/maps/` 的雷達圖與 `public/maps/icons/` 的官方地圖圖示，取自
> [MurkyYT/cs2-map-icons](https://github.com/MurkyYT/cs2-map-icons)（自遊戲本體自動抽取）。
>
> **報點座標怎麼來的**：Ancient / Nuke / Inferno / Anubis 的報點是用官方 `env_cs_place`
> 導航網格資料（place 名稱 + 世界座標，取自 awpy 1.x 內建 nav 資料）搭配官方雷達轉換參數
> （`pos_x` / `pos_y` / `scale`）換算成 0..1 座標，非目測標註。Mirage / Dust II 則是以座標格
> 人工校準。Train 因 CS2 已重製、舊 nav 座標不適用，報點待另行校準。

## 部署（GitHub Pages · 自動）

已內建 GitHub Actions 工作流 `.github/workflows/deploy.yml`：push 到 `main` 或本開發分支時，自動 build 並部署到 GitHub Pages（也可在 Actions 頁面手動觸發）。

**首次需一次性啟用 Pages**（此為 repo 設定，無法由程式碼開啟）：

1. GitHub repo → **Settings** → **Pages**。
2. **Build and deployment** 的 **Source** 選 **GitHub Actions**。
3. 之後每次 push，工作流會自動部署；完成後即可造訪
   **https://kalpy-hi.github.io/cs2-Map-Callouts/** 。

`vite.config.ts` 的 `base` 已設為 `'/cs2-Map-Callouts/'`（對應專案頁路徑）。若改用自訂網域或使用者／組織頁（根路徑），把 `base` 改為 `'/'`。

## 授權與素材說明

程式碼供自由使用。`public/maps/` 內的 CS2 地圖 minimap 屬 Valve 之遊戲版權素材，由專案擁有者自行提供；如需公開發佈，請確認你有合法使用權，或改用你自製／授權明確的雷達圖替換。
