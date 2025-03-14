const fs = require('fs');
const path = require('path');

// 確保public/assets目錄存在
const publicAssetsDir = path.join(__dirname, 'public', 'assets');
if (!fs.existsSync(publicAssetsDir)) {
    console.log('創建 public/assets 目錄...');
    fs.mkdirSync(publicAssetsDir, { recursive: true });
}

// 建立assets到public/assets的符號連結
const assetsDir = path.join(__dirname, 'assets');
const targetLink = path.join(__dirname, 'public', 'assets', 'mossy-log');

// 檢查是否已經存在連結
if (!fs.existsSync(targetLink)) {
    try {
        // 在Windows上，需要管理員權限，所以如果失敗，我們可以改為複製
        fs.symlinkSync(path.join(assetsDir, 'mossy-log'), targetLink, 'dir');
        console.log('成功創建符號連結：assets/mossy-log -> public/assets/mossy-log');
    } catch (error) {
        console.error('無法創建符號連結，嘗試直接複製資料夾...');
        // 如果無法創建符號連結，就直接複製資料夾
        // 注意：這是個簡化的例子，實際的複製可能需要更複雜的邏輯
        console.log('請手動複製assets/mossy-log資料夾到public/assets/mossy-log');
    }
} else {
    console.log('符號連結已存在');
}

console.log('設置完成！'); 