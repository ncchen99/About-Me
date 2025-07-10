# 個人介紹網頁

使用 Next.js、React、Styled-components 建立的個人介紹網頁，具有登入功能、GraphQL、Firebase 整合和 Phaser 互動畫面。

## 技術堆疊

- **前端框架**: Next.js 15 (App Router)
- **UI 庫**: React 18
- **樣式**: Styled-components
- **圖標**: Boxicons
- **認證**: NextAuth.js
- **資料庫**: Firebase Firestore
- **API**: GraphQL (Apollo Client)
- **遊戲引擎**: Phaser 3
- **語言**: TypeScript

## 功能特色

- 🎨 現代化響應式設計
- 🔐 完整的使用者認證系統
- 📊 GraphQL API 整合
- 🔥 Firebase 後端服務
- 🎮 Phaser 互動遊戲元素
- 🌐 伺服器端渲染 (SSR)
- 📱 行動裝置優化

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定環境變數

複製 `.env.example` 到 `.env.local` 並填入您的配置：

```bash
cp .env.example .env.local
```

需要設定的環境變數：
- Firebase 配置
- NextAuth 設定
- GraphQL API 端點
- Google OAuth 憑證 (可選)

### 3. 啟動開發伺服器

```bash
npm run dev
```

在瀏覽器中開啟 [http://localhost:3000](http://localhost:3000) 查看結果。

## 專案結構

```
src/
├── app/                 # Next.js App Router 頁面
│   ├── api/            # API 路由
│   ├── auth/           # 認證相關頁面
│   └── ...
├── components/         # 可重用組件
├── lib/               # 工具庫和配置
│   ├── apollo.ts      # GraphQL 客戶端
│   ├── firebase.ts    # Firebase 配置
│   └── providers.tsx  # Provider 包裝器
└── types/             # TypeScript 類型定義
```

## 開發指南

### 認證系統

使用 NextAuth.js 提供多種登入方式：
- 帳號密碼登入
- Google OAuth
- 可擴展其他 OAuth 提供者

### GraphQL 整合

使用 Apollo Client 進行 GraphQL 操作：
- 支援 SSR
- 自動快取
- 錯誤處理

### Phaser 遊戲

在 `src/components/PhaserGame.tsx` 中實現互動元素：
- 基本遊戲場景
- 物理引擎
- 響應式設計

## 部署

### Vercel (推薦)

```bash
npm run build
```

將專案推送到 GitHub 並連接 Vercel 進行自動部署。

### 其他平台

確保設定正確的環境變數並執行：

```bash
npm run build
npm start
```

## 貢獻

歡迎提交 Issue 和 Pull Request！

## 授權

MIT License
