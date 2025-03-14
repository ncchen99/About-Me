# 苔蘚木頭3D場景

這是一個使用React、Three.js和Tailwind CSS構建的3D場景展示網頁，主要展示一個苔蘚木頭模型。

## 功能

- 使用Three.js渲染高質量的3D場景
- 使用React作為前端框架
- 使用Tailwind CSS進行樣式設計
- 支持模型紋理和光照
- 互動式場景控制（旋轉、縮放等）

## 特色

- 首頁使用視差滾動效果，滑鼠移動時背景圖層會產生互動效果
- 3D 場景頁面展示苔蘚木頭模型
- 使用中文陳雨露演字體（ChenYuluoyan）
- 字體子集化處理，減少載入資源大小

## 目錄結構

```
├── public/                  # 靜態文件
│   ├── images/              # 背景圖片（天空、山脈、地面）
│   └── font/                # 字體文件
│       └── subset/          # 子集化後的字體
├── assets/                  # 3D模型和紋理
│   └── mossy-log/           # 苔蘚木頭模型資源
│       ├── source/          # 模型文件
│       └── textures/        # 紋理文件
├── src/                     # 源代碼
│   ├── components/          # React組件
│   │   └── MossyLogScene.js # 3D場景渲染組件
│   ├── styles/              # CSS樣式
│   ├── App.js               # 主應用組件
│   └── index.js             # 入口文件
├── tailwind.config.js       # Tailwind配置
├── postcss.config.js        # PostCSS配置
└── package.json             # 依賴項配置
```

## 安裝

1. 確保已安裝Node.js (v14或更高版本)
2. 克隆本倉庫
3. 安裝依賴：

```bash
npm install
```

2. 生成字體子集（可選，但建議執行以減少字體檔案大小）：

```bash
npm run subset-font
```

## 運行

```bash
npm start
```

應用將在[http://localhost:3000](http://localhost:3000)啟動

## 控制

- 左鍵拖動：旋轉場景
- 鼠標滾輪：縮放場景
- 右鍵拖動：平移場景

## 技術細節

- React 18
- Three.js
- React Three Fiber (Three.js的React渲染器)
- React Three Drei (Three.js的實用React組件)
- Tailwind CSS

### 視差滾動

首頁的視差效果是通過追蹤滑鼠移動位置，根據不同圖層的深度設定不同的移動速度來實現的。圖層從後到前為：

- 天空 (sky.png) - 最遠，移動最少
- 山脈 (mount.png) - 中間層，移動適中
- 地面 (ground.png) - 最近，移動最多

### 字體子集化

為了優化網頁載入速度，我們使用 Fontmin 處理中文字體，僅保留網頁中使用到的字符。這個過程會：

1. 掃描所有 JavaScript 和 HTML 文件中的中文字符
2. 生成僅包含這些字符的字體子集
3. 轉換為 WOFF2 格式，進一步減少檔案大小

## 注意事項

- 字體子集化需要有 Node.js 環境
- 開發過程中添加新的中文文字後，需要重新運行字體子集化腳本 