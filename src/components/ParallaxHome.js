import React, { useEffect, useState, useRef, useCallback } from 'react';

const ParallaxHome = ({ onScrollToBottom }) => {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [scrollPosition, setScrollPosition] = useState(0);
    const [is3DMode, setIs3DMode] = useState(false);
    const [blurAmount, setBlurAmount] = useState(10); // 初始模糊值
    const [showCredits, setShowCredits] = useState(false); // 顯示素材資訊
    const [isMobile, setIsMobile] = useState(false); // 檢測是否為移動設備
    const containerRef = useRef(null);
    const groundLayerRef = useRef(null); // 參考地面圖層
    const ticking = useRef(false);
    const lastScrollY = useRef(0);
    const inkAnimationRef = useRef(null); // 用於重設ink動畫

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

    // 進場動畫 - 毛玻璃效果淡出
    useEffect(() => {
        const fadeInDuration = 2200; // 2秒內完成淡入
        const startTime = Date.now();

        const fadeInAnimation = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / fadeInDuration, 1);
            const newBlurAmount = 10 * (1 - progress);

            setBlurAmount(newBlurAmount);

            if (progress < 1) {
                requestAnimationFrame(fadeInAnimation);
            }
        };

        requestAnimationFrame(fadeInAnimation);

        // 確保重置ink動畫
        const resetInkAnimation = () => {
            // 選擇ink動畫元素
            const inkElement = document.querySelector('.ink-reveal-animation');
            const inkContent = document.querySelector('.ink-content');

            if (inkElement && inkContent) {
                // 重置第一個動畫
                inkElement.style.animation = 'none';
            }
        };

        // 初次執行，確保動畫播放
        resetInkAnimation();

        // 為了方便調試，添加重置動畫的方法
        inkAnimationRef.current = resetInkAnimation;
    }, []);

    // 當滾動位置變化時，更新主題顏色
    useEffect(() => {
        // 判斷是否進入3D模式的閾值
        const threshold = 400;
        const newIs3DMode = scrollPosition > threshold;

        // 每次滾動位置改變時都更新主題顏色
        updateThemeColor(newIs3DMode);
        setIs3DMode(newIs3DMode);
    }, [scrollPosition]);

    // 更新主題顏色函數
    const updateThemeColor = (is3D) => {
        // 設置CSS變數供全局使用
        document.documentElement.style.setProperty('--theme-color', is3D ? '#f59e0b' : '#ec4899');

        // 更新3D場景中的按鈕樣式
        const buttons3D = document.querySelectorAll('.scene-3d-button');
        buttons3D.forEach(button => {
            if (is3D) {
                button.classList.add('styled-button-amber');
                button.classList.remove('styled-button');
            } else {
                button.classList.add('styled-button');
                button.classList.remove('styled-button-amber');
            }
        });

        // 更新3D場景中的面板樣式
        const panels3D = document.querySelectorAll('.scene-3d-panel');
        panels3D.forEach(panel => {
            // 明確指定背景和邊框顏色，不依賴於類名切換
            if (is3D) {
                panel.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                panel.style.borderColor = 'rgba(217, 119, 6, 0.5)';
                panel.style.color = '#fcd34d';
                panel.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 191, 0, 0.15)';
            } else {
                panel.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                panel.style.borderColor = 'rgba(236, 72, 153, 0.5)';
                panel.style.color = '#fbcfe8';
                panel.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(236, 72, 153, 0.15)';
            }
        });
    };

    // 滑鼠移動時更新偏移量 (使用優化的節流)
    useEffect(() => {
        let rafId = null;

        const handleMouseMove = (e) => {
            if (!ticking.current) {
                rafId = window.requestAnimationFrame(() => {
                    const x = e.clientX / window.innerWidth;
                    const y = e.clientY / window.innerHeight;
                    setOffset({
                        x: (x - 0.5) * 20,
                        y: (y - 0.5) * 20
                    });
                    ticking.current = false;
                });
                ticking.current = true;
            }
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (rafId) {
                window.cancelAnimationFrame(rafId);
            }
        };
    }, []);

    // 使用 debounce 處理滾動事件，提供更平滑的體驗
    const handleScroll = useCallback(() => {
        if (!ticking.current) {
            window.requestAnimationFrame(() => {
                const container = containerRef.current;
                if (container) {
                    const position = container.scrollTop;
                    const delta = position - lastScrollY.current;

                    // 減緩滾動速度，將實際滾動量除以 3
                    const slowedPosition = lastScrollY.current + (delta * 0.4);

                    // 只有滾動量超過閾值才更新，減少不必要的狀態更新
                    if (Math.abs(delta) > 2) {
                        setScrollPosition(slowedPosition);
                        lastScrollY.current = slowedPosition;
                    }

                    const isNearBottom = position + container.clientHeight >= container.scrollHeight - 100;
                    if (isNearBottom && onScrollToBottom) {
                        onScrollToBottom();
                    }
                }
                ticking.current = false;
            });
            ticking.current = true;
        }
    }, [onScrollToBottom]);

    // 監聽滾動事件
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // 使用 passive 提升滾動性能
        container.addEventListener('scroll', handleScroll, { passive: true });

        // 確保初始化時使用粉色主題
        updateThemeColor(false);
        setIs3DMode(false);

        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    // 計算滾動時的暗度
    const getDarkness = (layer) => {
        const maxDarkness = 0.7;
        const scrollFactor = Math.min(scrollPosition / 500, 1);
        switch (layer) {
            case 'sky': return scrollFactor * maxDarkness;
            case 'mountain': return scrollFactor * maxDarkness * 0.7;
            case 'ground': return scrollFactor * maxDarkness * 0.4;
            default: return 0;
        }
    };

    // 計算文字可見度 - 只在接近3D場景時才開始消失
    const getTextOpacity = () => {
        // 定義開始淡出的滾動位置
        const fadeStartPosition = 300;
        const fadeEndPosition = 600;

        if (scrollPosition < fadeStartPosition) {
            return 1; // 完全顯示
        } else if (scrollPosition > fadeEndPosition) {
            return 0; // 完全隱藏
        } else {
            // 線性漸變
            return 1 - (scrollPosition - fadeStartPosition) / (fadeEndPosition - fadeStartPosition);
        }
    };

    // 獲取適合不同設備的背景尺寸和位置
    const getBackgroundStyle = (layer) => {
        // 基本樣式
        const baseStyle = {
            position: 'absolute',
            left: 0,
            right: 0,
            width: '100%',
            backgroundRepeat: 'no-repeat',
            pointerEvents: 'none'
        };

        // 根據圖層和設備調整樣式
        if (isMobile) {
            // 移動設備樣式 - 修改為填滿高度優先
            switch (layer) {
                case 'sky':
                    return {
                        ...baseStyle,
                        top: 0,
                        height: '100vh',  // 固定高度為視窗高度
                        backgroundImage: `url('/images/sky.png')`,
                        backgroundSize: 'auto 100%',  // 高度100%，寬度自動調整
                        backgroundPosition: 'center center',
                        zIndex: 1
                    };
                case 'mountain':
                    return {
                        ...baseStyle,
                        top: 0,
                        height: '100vh',  // 固定高度為視窗高度
                        backgroundImage: `url('/images/mount.png')`,
                        backgroundSize: 'auto 100%',  // 高度100%，寬度自動調整
                        backgroundPosition: 'center center',
                        zIndex: 2
                    };
                case 'ground':
                    return {
                        ...baseStyle,
                        top: 0,
                        height: '100vh',  // 固定高度為視窗高度
                        backgroundImage: `url('/images/ground.png')`,
                        backgroundSize: 'auto 100%',  // 高度100%，寬度自動調整
                        backgroundPosition: 'center center',
                        zIndex: 3
                    };
                default:
                    return baseStyle;
            }
        } else {
            // 桌面設備樣式
            switch (layer) {
                case 'sky':
                    return {
                        ...baseStyle,
                        top: 0,
                        height: 'auto',
                        minHeight: '100vh',
                        backgroundImage: `url('/images/sky.png')`,
                        backgroundSize: '100% auto',
                        backgroundPosition: 'center top',
                        zIndex: 1
                    };
                case 'mountain':
                    return {
                        ...baseStyle,
                        top: 0,
                        height: 'auto',
                        minHeight: '100vh',
                        backgroundImage: `url('/images/mount.png')`,
                        backgroundSize: '100% auto',
                        backgroundPosition: 'center top',
                        zIndex: 2
                    };
                case 'ground':
                    return {
                        ...baseStyle,
                        top: 0,
                        height: 'auto',
                        minHeight: '100vh',
                        backgroundImage: `url('/images/ground.png')`,
                        backgroundSize: '100% auto',
                        backgroundPosition: 'center top',
                        zIndex: 3
                    };
                default:
                    return baseStyle;
            }
        }
    };

    // 在渲染完成後顯示狀態信息增加更多調試訊息
    useEffect(() => {
        // 檢查地面圖層的實際尺寸
        const logSizes = () => {
            if (groundLayerRef.current) {
                const groundRect = groundLayerRef.current.getBoundingClientRect();
                console.log('Ground Layer:', {
                    offsetHeight: groundLayerRef.current.offsetHeight,
                    offsetWidth: groundLayerRef.current.offsetWidth,
                    getBoundingClientRect: groundRect
                });

                // 計算地面圖層底部相對於視窗頂部的位置
                const groundBottom = groundRect.bottom;
                console.log('Ground bottom position:', groundBottom, 'window height:', window.innerHeight);

                // 將這個位置顯示為一個調試標記
                const debugMarker = document.getElementById('debug-shadow-marker');
                if (debugMarker) {
                    debugMarker.style.top = `${groundRect.bottom}px`;
                }
            }
        };

        // 初次渲染和屏幕大小變化時都進行檢查
        logSizes();
        window.addEventListener('resize', logSizes);
        window.addEventListener('scroll', logSizes);

        return () => {
            window.removeEventListener('resize', logSizes);
            window.removeEventListener('scroll', logSizes);
        };
    }, []);

    return (
        <>
            {/* Ink Effect Mask Animation - 使用新的結構，參考Lundev網站 */}
            <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
                <div className="ink-reveal-animation absolute inset-0 bg-transparent"></div>
                <div className="ink-content absolute inset-0 bg-transparent"></div>
            </div>

            {/* 進入時的模糊效果覆蓋層 */}
            {blurAmount > 0.1 && (
                <div
                    className="fixed inset-0 z-40 pointer-events-none bg-black/30"
                    style={{
                        backdropFilter: `blur(${blurAmount}px)`,
                        WebkitBackdropFilter: `blur(${blurAmount}px)`,
                        transition: 'backdrop-filter 0.5s, opacity 0.5s',
                        opacity: blurAmount / 10
                    }}
                />
            )}

            <div
                ref={containerRef}
                className="parallax-container h-screen w-full overflow-x-hidden overflow-y-auto relative"
            >
                <div className="parallax-content min-h-[200vh]">
                    {/* 天空圖層 */}
                    <div
                        className="parallax-layer"
                        style={{
                            ...getBackgroundStyle('sky'),
                            transform: `translate3d(${offset.x * 0.2}px, ${(offset.y * 0.2) - (scrollPosition * 0.05)}px, 0)`,
                            filter: `brightness(${1 - getDarkness('sky')})`,
                            willChange: 'transform, filter'
                        }}
                    />

                    {/* 山脈圖層 */}
                    <div
                        className="parallax-layer"
                        style={{
                            ...getBackgroundStyle('mountain'),
                            transform: `translate3d(${offset.x * 0.5}px, ${(offset.y * 0.5) - (scrollPosition * 0.15) - 20}px, 0)`,
                            filter: `brightness(${1 - getDarkness('mountain')})`,
                            willChange: 'transform, filter'
                        }}
                    />

                    {/* 地面圖層 */}
                    <div
                        ref={groundLayerRef}
                        className="parallax-layer"
                        style={{
                            ...getBackgroundStyle('ground'),
                            transform: `translate3d(${offset.x * 0.8}px, ${(offset.y * 0.8) - (scrollPosition * 0.3) - 40}px, 0)`,
                            filter: `brightness(${1 - getDarkness('ground')})`,
                            willChange: 'transform, filter',
                        }}
                    />
                </div>
            </div>

            {/* 內容區塊 - 使用固定在視口之外的元素，確保不受滾動影響 */}
            <div
                className="fixed left-0 right-0 z-30 p-4 pointer-events-none"
                style={{
                    top: '60%',
                    transform: 'translateY(-50%)',
                    opacity: getTextOpacity(),
                    willChange: 'opacity',
                    textAlign: 'center'
                }}
            >
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
                        一花一世界
                    </h1>
                    <p className="text-xl md:text-2xl text-white drop-shadow-md max-w-2xl mb-12">
                        我的心，為你跳動，更為這個不完美的世界燃燒
                        <br /> 我愛你，也愛這片大地和浩瀚星空
                    </p>
                    {/* 引導箭頭 */}
                    <div className="animate-bounce flex flex-col items-center mt-4">
                        <span className="text-lg mb-2 text-white">向下滾動</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* 素材資訊按鈕 */}
            <button
                onClick={() => setShowCredits(true)}
                className="fixed bottom-4 right-4 z-20 p-2 bg-pink-500/30 hover:bg-pink-500/50 rounded-full border border-pink-300/50 text-white shadow-lg backdrop-blur-sm transition-all duration-300 pointer-events-auto styled-button"
                style={{ opacity: showCredits ? 0 : 1 }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>

            {/* 素材資訊彈出視窗 */}
            {showCredits && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowCredits(false)}
                    ></div>
                    <div className="relative bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-100 opacity-100 styled-panel">
                        <button
                            onClick={() => setShowCredits(false)}
                            className="absolute top-3 right-3 text-pink-500 hover:text-pink-700 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h3 className="text-2xl font-bold text-pink-600 mb-4">素材來源與連結</h3>

                        <div className="space-y-4">
                            <div className="p-3 bg-white/80 rounded-lg backdrop-blur-sm shadow-sm">
                                <h4 className="text-lg font-semibold text-pink-500 mb-2">視覺效果</h4>
                                <p className="text-gray-700 mb-2">Ink overlay effects used in this project:</p>
                                <a
                                    href="https://www.vecteezy.com/free-videos/ink-overlay"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-pink-500 hover:text-pink-700 font-medium inline-flex items-center transition-colors"
                                >
                                    <span>Ink Overlay Stock Videos by Vecteezy</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>

                            <div className="p-3 bg-white/80 rounded-lg backdrop-blur-sm shadow-sm">
                                <h4 className="text-lg font-semibold text-pink-500 mb-2">3D 模型</h4>
                                <p className="text-gray-700 mb-2">"Mossy log" 3D model used in scene:</p>
                                <a
                                    href="https://sketchfab.com/3d-models/mossy-log-cddd09ba67f04233997bec620e9e0a22"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-pink-500 hover:text-pink-700 font-medium inline-flex items-center transition-colors"
                                >
                                    <span>By July (sketchfab.com/july.pl034)</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>

                            <div className="p-3 bg-white/80 rounded-lg backdrop-blur-sm shadow-sm">
                                <h4 className="text-lg font-semibold text-pink-500 mb-2">GitHub</h4>
                                <p className="text-gray-700 mb-2">這個專案的源代碼已經在GitHub上開源：</p>
                                <a
                                    href="https://github.com/ncchen99/About-Me"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-pink-500 hover:text-pink-700 font-medium inline-flex items-center transition-colors"
                                >
                                    <span>查看源代碼</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ParallaxHome; 