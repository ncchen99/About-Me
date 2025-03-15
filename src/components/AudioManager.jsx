import React, { useEffect, useRef, useState } from 'react';

// 音頻管理組件 - 處理背景音樂和交互音效
function AudioManager() {
    const backgroundMusicRef = useRef(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [hasStarted, setHasStarted] = useState(false);

    // 偵測視窗大小變化
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // 初始化背景音樂
    useEffect(() => {
        // 創建一個新的音頻元素
        const bgMusic = new Audio('/audio/ambient-forest-night.mp3');
        bgMusic.loop = true;
        bgMusic.volume = 0.25; // 設置默認音量
        bgMusic.preload = 'auto'; // 預加載音頻

        // 將音頻元素存儲到ref中
        backgroundMusicRef.current = bgMusic;

        // 當用戶與頁面互動時才播放音樂（瀏覽器政策）
        const handleInteraction = async () => {
            if (!hasStarted && backgroundMusicRef.current && backgroundMusicRef.current.paused) {
                try {
                    setHasStarted(true);
                    // 設置音量為0，避免突然的聲音
                    backgroundMusicRef.current.volume = 0;
                    await backgroundMusicRef.current.play();
                    // 漸進式增加音量
                    let vol = 0;
                    const fadeIn = setInterval(() => {
                        vol += 0.05;
                        if (vol >= 0.25) {
                            vol = 0.25;
                            clearInterval(fadeIn);
                        }
                        backgroundMusicRef.current.volume = vol;
                    }, 100);
                } catch (error) {
                    console.warn('無法自動播放音樂：', error);
                }
            }

            // 移除事件監聽器，避免重複
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
        };

        // 添加事件監聽器
        document.addEventListener('click', handleInteraction);
        document.addEventListener('touchstart', handleInteraction);

        // 組件卸載時停止音樂並清理
        return () => {
            if (backgroundMusicRef.current) {
                backgroundMusicRef.current.pause();
                backgroundMusicRef.current = null;
            }
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
        };
    }, [hasStarted]); // 添加 hasStarted 作為依賴項

    // 切換靜音狀態
    const toggleMute = () => {
        if (backgroundMusicRef.current) {
            if (isMuted) {
                backgroundMusicRef.current.volume = 0.25;
            } else {
                backgroundMusicRef.current.volume = 0;
            }
            setIsMuted(!isMuted);
        }
    };

    // 播放互動音效
    const playSound = (soundName) => {
        // 如果被靜音，則不播放
        if (isMuted) return;

        const sound = new Audio(`/audio/${soundName}.mp3`);
        sound.volume = 0.5;
        sound.play().catch(e => console.warn(`無法播放音效 ${soundName}:`, e));
    };

    // 將方法和狀態暴露給全局，以便其他組件使用
    window.audioManager = {
        playSound,
        toggleMute,
        isMuted: () => isMuted
    };

    // 顯示音量控制按鈕
    return (
        <button
            onClick={toggleMute}
            className={`absolute bottom-4 right-4 z-20 styled-button-amber scene-3d-button ${isMobile ? 'w-12 h-12 p-2 rounded-full flex items-center justify-center' : ''}`}
            aria-label={isMuted ? "取消靜音" : "靜音"}
        >
            {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
            )}
        </button>
    );
}

export default AudioManager; 