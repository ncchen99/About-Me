import Fontmin from 'fontmin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 讀取所有可能需要的中文文字
function collectTextFromFiles() {
    // 設定要搜索的目錄
    const sourceDirectories = ['./src'];
    let allText = '';

    // 遞迴搜索目錄
    function searchDirectory(dir) {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                searchDirectory(filePath);
            } else if (
                file.endsWith('.js') ||
                file.endsWith('.jsx') ||
                file.endsWith('.ts') ||
                file.endsWith('.tsx') ||
                file.endsWith('.html')
            ) {
                // 讀取文件內容
                const content = fs.readFileSync(filePath, 'utf8');

                // 提取所有中文字符
                const chineseChars = content.match(/[\u4e00-\u9fa5]/g);
                if (chineseChars) {
                    allText += chineseChars.join('');
                }
            }
        }
    }

    // 開始搜索
    for (const dir of sourceDirectories) {
        searchDirectory(dir);
    }

    // 去除重複字符
    return [...new Set(allText)].join('');
}

// 主函數
async function subsetFont() {
    // 獲取所有需要的中文字符
    const text = collectTextFromFiles();

    // 添加一些基本常用字符
    const basicChars = '，。！？：；（）【】「」『』、…—《》""0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const finalText = text + basicChars;

    console.log(`找到 ${finalText.length} 個唯一字符需要包含在字體中`);

    // 創建輸出目錄
    const outputDir = path.join(__dirname, '../public/font/subset');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // 設置 Fontmin
    const fontmin = new Fontmin()
        .src(path.join(__dirname, '../public/font/ChenYuluoyan-2.0-Thin.ttf'))
        .dest(outputDir)
        .use(Fontmin.glyph({
            text: finalText,
            hinting: false  // 關閉 hinting 以減小文件大小
        }))
        .use(Fontmin.ttf2woff2());  // 轉換為 woff2 格式，體積更小

    // 執行字體子集化
    fontmin.run((err, files) => {
        if (err) {
            console.error('字體子集化過程中發生錯誤:', err);
            return;
        }

        console.log('字體子集化成功完成!');

        // 輸出原始大小和新的大小
        const originalSize = fs.statSync(path.join(__dirname, '../public/font/ChenYuluoyan-2.0-Thin.ttf')).size;
        const newSize = fs.statSync(path.join(outputDir, 'ChenYuluoyan-2.0-Thin.ttf')).size;
        const woff2Size = fs.statSync(path.join(outputDir, 'ChenYuluoyan-2.0-Thin.woff2')).size;

        console.log(`原始字體大小: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`子集化 TTF 大小: ${(newSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`子集化 WOFF2 大小: ${(woff2Size / 1024 / 1024).toFixed(2)} MB`);
        console.log(`節省: ${((originalSize - woff2Size) / originalSize * 100).toFixed(2)}%`);
    });
}

// 執行
subsetFont(); 