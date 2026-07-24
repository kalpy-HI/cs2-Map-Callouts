import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages 專案頁面路徑（repo 名稱）。本機開發不受影響。
// 若日後改用自訂網域或使用者頁面，將 base 改為 '/' 即可。
export default defineConfig({
  base: '/cs2-Map-Callouts/',
  plugins: [react()],
});
