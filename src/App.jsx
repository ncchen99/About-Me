import React, { useState, useEffect, lazy, Suspense, createContext, useContext } from 'react';
import MossyLogScene from './components/MossyLogScene.jsx';
import AudioManager from './components/AudioManager.jsx';
import ParallaxHome from './components/ParallaxHome.jsx';

// 創建資源加載上下文
export const ResourceContext = createContext({
    resourcesLoaded: false,
    setResourcesLoaded: () => { }
});

// 預加載3D場景素材的組件 - 使用 React.memo 避免不必要的重新渲染
const PreloadResources = React.memo(({ isVisible }) => {
    const { resourcesLoaded, setResourcesLoaded } = useContext(ResourceContext);

    // 只有一次性預加載，避免重複加載
    useEffect(() => {
        if (!resourcesLoaded) {
            console.log("開始預加載資源...");

            // 5秒後標記為已加載，無論加載結果如何
            const timer = setTimeout(() => {
                console.log("預加載完成");
                setResourcesLoaded(true);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [resourcesLoaded, setResourcesLoaded]);

    // 如果資源已加載，就不再渲染預加載組件
    if (resourcesLoaded) return null;

    // 如果組件不可見，仍然進行加載但不渲染
    const style = {
        display: isVisible ? 'block' : 'none',
        position: 'absolute',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        opacity: 0,
        pointerEvents: 'none',
        zIndex: -100
    };

    return (
        <div style={style}>
            <MossyLogScene isPreloading={true} />
        </div>
    );
});

function App() {
    const [showInfo, setShowInfo] = useState(true);
    const [currentView, setCurrentView] = useState('home'); // 'home', 'transitioning', or '3d'
    const [transitionProgress, setTransitionProgress] = useState(0);
    const [resourcesLoaded, setResourcesLoaded] = useState(false);
    const [isMobile, setIsMobile] = useState(false); // 新增：檢測是否為移動設備
    const [startPreload, setStartPreload] = useState(false); // 控制何時開始預加載

    // 檢測設備類型
    useEffect(() => {
        const checkDevice = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        // 初始檢測
        checkDevice();

        // 視窗大小改變時重新檢測
        window.addEventListener('resize', checkDevice);

        return () => {
            window.removeEventListener('resize', checkDevice);
        };
    }, []);

    // 初始化時設置3D場景元素樣式
    useEffect(() => {
        if (currentView === '3d') {
            // 應用琥珀色主題
            document.documentElement.style.setProperty('--theme-color', '#f59e0b');

            // 更新所有3D按鈕樣式
            const buttons = document.querySelectorAll('.scene-3d-button');
            buttons.forEach(button => {
                button.classList.remove('styled-button');
                button.classList.add('styled-button-amber');
            });

            // 更新所有3D面板樣式
            const panels = document.querySelectorAll('.scene-3d-panel');
            panels.forEach(panel => {
                panel.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                panel.style.borderColor = 'rgba(217, 119, 6, 0.5)';
                panel.style.color = '#fcd34d';
                panel.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 191, 0, 0.15)';
            });
        }
    }, [currentView]);

    // 處理視圖轉換的平滑動畫
    useEffect(() => {
        if (currentView === 'transitioning') {
            let startTime;
            const duration = 1500; // 轉換持續1.5秒

            const animate = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);

                setTransitionProgress(progress);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    setCurrentView('3d');
                    setTransitionProgress(0);

                    // 進入3D場景時，確保應用琥珀色主題
                    document.documentElement.style.setProperty('--theme-color', '#f59e0b');

                    // 更新所有3D按鈕樣式
                    const buttons = document.querySelectorAll('.scene-3d-button');
                    buttons.forEach(button => {
                        button.classList.remove('styled-button');
                        button.classList.add('styled-button-amber');
                    });

                    // 更新所有3D面板樣式
                    const panels = document.querySelectorAll('.scene-3d-panel');
                    panels.forEach(panel => {
                        panel.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                        panel.style.borderColor = 'rgba(217, 119, 6, 0.5)';
                        panel.style.color = '#fcd34d';
                        panel.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 191, 0, 0.15)';
                    });
                }
            };

            requestAnimationFrame(animate);
        }
    }, [currentView]);

    // 在頁面加載後開始預加載資源
    useEffect(() => {
        // 設置一個計時器，在用戶瀏覽主頁一段時間後開始預加載
        const timer = setTimeout(() => {
            setStartPreload(true);
        }, 3000); // 3秒後開始預加載

        return () => clearTimeout(timer);
    }, []);

    // 處理視差滾動到底部的回調
    const handleScrollToBottom = () => {
        if (currentView === 'home') {
            setCurrentView('transitioning');
        }
    };


    // 返回主頁
    const handleReturnToHome = () => {
        setCurrentView('home');
        // 重置主題顏色為粉色
        document.documentElement.style.setProperty('--theme-color', '#ec4899');
        // 重置所有按鈕和面板的樣式
        const buttons = document.querySelectorAll('.scene-3d-button');
        buttons.forEach(button => {
            button.classList.remove('styled-button-amber');
            button.classList.add('styled-button');
        });
        const panels = document.querySelectorAll('.scene-3d-panel');
        panels.forEach(panel => {
            panel.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
            panel.style.borderColor = 'rgba(236, 72, 153, 0.5)';
            panel.style.color = '#fbcfe8';
            panel.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(236, 72, 153, 0.15)';
        });
    };

    return (
        <ResourceContext.Provider value={{ resourcesLoaded, setResourcesLoaded }}>
            <div className="w-full h-full bg-black relative overflow-auto" style={{ scrollbarWidth: 'none' }}>
                <style>{`
                    ::-webkit-scrollbar {
                        display: none;
                    }
                    body {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                        overflow: auto;
                        height: 100vh;
                    }
                    html {
                        height: 100%;
                        overflow: auto;
                    }
                    @keyframes neonPulse {
                        0% {
                            box-shadow: 
                                0 0 5px 1px rgba(245, 158, 11, 0.8),
                                0 0 10px 2px rgba(245, 158, 11, 0.6),
                                0 0 15px 3px rgba(245, 158, 11, 0.4),
                                0 0 20px 4px rgba(245, 158, 11, 0.2);
                        }
                        50% {
                            box-shadow: 
                                0 0 10px 2px rgba(245, 158, 11, 0.9),
                                0 0 20px 4px rgba(245, 158, 11, 0.7),
                                0 0 30px 6px rgba(245, 158, 11, 0.5),
                                0 0 40px 8px rgba(245, 158, 11, 0.3);
                        }
                        100% {
                            box-shadow: 
                                0 0 5px 1px rgba(245, 158, 11, 0.8),
                                0 0 10px 2px rgba(245, 158, 11, 0.6),
                                0 0 15px 3px rgba(245, 158, 11, 0.4),
                                0 0 20px 4px rgba(245, 158, 11, 0.2);
                        }
                    }
                `}</style>
                {/* 預加載3D場景資源 - 只有在需要時才顯示 */}
                {startPreload && !resourcesLoaded && <PreloadResources isVisible={false} />}

                {currentView === 'home' && (
                    <>
                        {/* 視差滾動主頁 */}
                        <ParallaxHome onScrollToBottom={handleScrollToBottom} />
                    </>
                )}

                {currentView === 'transitioning' && (
                    <div className="fixed inset-0 bg-black z-30 flex items-center justify-center">
                        <div className="text-center text-amber-200">
                            <div className="mb-4 text-2xl">夜深了...</div>
                            <div className="w-64 h-3 bg-gray-900 rounded-full overflow-hidden shadow-inner relative">
                                <div
                                    className="h-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 transition-all"
                                    style={{
                                        width: `${transitionProgress * 100}%`,
                                        boxShadow: `
                                            0 0 5px 1px rgba(245, 158, 11, 0.8),
                                            0 0 10px 2px rgba(245, 158, 11, 0.6),
                                            0 0 15px 3px rgba(245, 158, 11, 0.4),
                                            0 0 20px 4px rgba(245, 158, 11, 0.2)
                                        `,
                                        animation: 'neonPulse 1.5s ease-in-out infinite'
                                    }}
                                />
                                <div className="absolute top-0 left-0 w-full h-full opacity-50 bg-[radial-gradient(circle,_rgba(255,255,255,0.8)_0%,_transparent_70%)] animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                )}

                <div
                    className={`absolute inset-0 transition-opacity duration-500 ${currentView === '3d' ? 'opacity-100 z-20' : 'opacity-0 -z-10'
                        }`}
                >
                    {/* 3D場景 - 只在當前視圖為3D時渲染 */}
                    {currentView === '3d' && (
                        <>
                            <MossyLogScene />
                            <AudioManager />
                        </>
                    )}

                    {/* 標題和說明 - 調整手機版樣式，增大字體大小 */}
                    <div className={`absolute z-10 p-3 md:p-4 text-amber-200 bg-black bg-opacity-60 rounded-lg border border-amber-700/50 scene-3d-panel ${isMobile ? 'top-2 left-2 right-2 text-center' : 'top-4 left-4'}`}>
                        <h1 className={`font-bold ${isMobile ? 'text-2xl' : 'text-3xl'}`}>螢火蟲之木</h1>
                        <p className={`opacity-90 ${isMobile ? 'text-sm' : 'text-sm'}`}>關注、責任、尊重、了解，與愛人愛世界，這是我所追求的究極力量</p>
                    </div>

                    {/* 返回主頁按鈕 - 手機版放在底部最左側 */}
                    <button
                        onClick={handleReturnToHome}
                        className={`absolute z-20 styled-button-amber scene-3d-button ${isMobile
                            ? 'bottom-4 left-4 p-2 text-xs rounded-full w-12 h-12 flex items-center justify-center'
                            : 'top-4 right-4'
                            }`}
                    >
                        {isMobile ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        ) : (
                            <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                返回主頁
                            </span>
                        )}
                    </button>

                    {/* 控制說明 - 手機版做特殊處理，位置在底部按鈕上方 */}
                    {showInfo && (
                        <div className={`absolute z-10 text-amber-200 bg-black bg-opacity-80 rounded-lg border border-amber-700/50 scene-3d-panel ${isMobile
                            ? 'p-3 bottom-20 left-1/2 transform -translate-x-1/2 w-11/12 max-h-48 overflow-y-auto'
                            : 'p-4 bottom-4 left-4'
                            }`}>
                            <div className="flex justify-between items-center mb-2">
                                <h2 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>控制說明</h2>
                                <button
                                    onClick={() => setShowInfo(false)}
                                    className="text-amber-200 hover:text-white"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            <ul className={isMobile ? 'text-sm' : 'text-sm'}>
                                <li className="mb-1">• 左鍵拖動：旋轉場景</li>
                                <li className="mb-1">• 滾輪：縮放</li>
                                <li className="mb-1">• 右鍵拖動：平移場景</li>
                                <li className="mb-1">• 點擊木頭/花朵/苔蘚：觸發音效</li>
                                <li className="mb-1">• 點擊發光粒子：互動效果</li>
                            </ul>
                        </div>
                    )}

                    {/* 控制按鈕組 - 手機版固定在底部中間 */}
                    {!showInfo && (
                        <div className={`fixed ${isMobile ? 'bottom-4 left-1/2 transform -translate-x-1/2 z-20' : 'bottom-4 left-4 z-10'}`}>
                            <button
                                onClick={() => setShowInfo(true)}
                                className={`styled-button-amber scene-3d-button ${isMobile
                                    ? 'p-2 rounded-full w-12 h-12 flex items-center justify-center'
                                    : 'p-2'
                                    }`}
                            >
                                {isMobile ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ) : (
                                    <span className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        控制說明
                                    </span>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </ResourceContext.Provider>
    );
}

export default App; 