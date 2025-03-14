const fs = require('fs');
const path = require('path');

// 確保音頻目錄存在
const audioDir = path.join(__dirname, 'public', 'audio');
if (!fs.existsSync(audioDir)) {
    console.log('創建音頻目錄...');
    fs.mkdirSync(audioDir, { recursive: true });
}

// 要創建的音頻文件列表
const audioFiles = [
    'ambient-forest-night.mp3',
    'wood-knock.mp3',
    'mushroom-squish.mp3',
    'flower-rustle.mp3',
    'ground-step.mp3',
    'particle-click.mp3',
    'floor-tap.mp3'
];

// 在這裡我們只是創建空文件作為占位符
// 在實際應用中，您需要使用真實的音頻文件
audioFiles.forEach(fileName => {
    const filePath = path.join(audioDir, fileName);

    // 檢查文件是否已存在
    if (!fs.existsSync(filePath)) {
        console.log(`創建音頻文件占位符: ${fileName}`);

        // 創建一個簡單的MP3文件頭部 (這不是真實的MP3，僅用於占位)
        const header = Buffer.from([
            0x49, 0x44, 0x33, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0A,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
        ]);

        fs.writeFileSync(filePath, header);
    } else {
        console.log(`音頻文件已存在: ${fileName}`);
    }
});

console.log('音頻文件占位符創建完成！');
console.log('注意: 這些僅是占位符，請在實際應用中替換為真實的音頻文件。'); 