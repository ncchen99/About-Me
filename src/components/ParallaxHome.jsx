import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useAnimation, AnimatePresence, frame, cancelFrame } from "framer-motion";
import { animate, stagger } from "motion";
import { splitText } from "motion-plus";
import Lenis from 'lenis'; // 直接導入 Lenis

const ParallaxHome = ({ onScrollToBottom }) => {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [scrollPosition, setScrollPosition] = useState(0);
    const [is3DMode, setIs3DMode] = useState(false);
    const [blurAmount, setBlurAmount] = useState(10); // 初始模糊值
    const [showCredits, setShowCredits] = useState(false); // 顯示素材資訊
    const [isMobile, setIsMobile] = useState(false); // 檢測是否為移動設備
    const [animationsReady, setAnimationsReady] = useState(false); // 追蹤初始動畫是否完成
    const [arrowVisible, setArrowVisible] = useState(false); // 控制引導箭頭的顯示
    const containerRef = useRef(null);
    const scrollWrapperRef = useRef(null); // 滾動容器參考
    const scrollContentRef = useRef(null); // 滾動內容參考
    const groundLayerRef = useRef(null); // 參考地面圖層
    const inkAnimationRef = useRef(null); // 用於重設ink動畫
    const titleRef = useRef(null); // 標題文字引用
    const descRef = useRef(null); // 描述文字引用
    const arrowRef = useRef(null); // 引導箭頭引用
    const lastScrollRef = useRef(0); // 儲存最後的滾動位置
    const mousePositionRef = useRef({ x: 0, y: 0 }); // 儲存滑鼠位置
    const modalRef = useRef(null); // 模態框參考
    const titleAnimCompleteRef = useRef(false); // 追蹤標題動畫是否完成
    const descAnimCompleteRef = useRef(false); // 追蹤描述動畫是否完成
    const lenisRef = useRef(null); // 存儲 Lenis 實例的引用

    // 初始高度調整 - 修改起始位置高20px
    const initialMountainOffset = 15;
    const initialGroundOffset = 30;

    // 手動創建 Motion 值用於跟蹤滾動
    const scrollYMotionValue = useMotionValue(0);

    // 使用 requestAnimationFrame 驅動 Lenis
    useEffect(() => {
        try {
            console.log('初始化Lenis滾動...');

            // 創建 Lenis 實例，使用指定的容器
            const lenis = new Lenis({
                wrapper: scrollWrapperRef.current, // 指定滾動容器
                content: scrollContentRef.current, // 指定滾動內容
                duration: 1.0, // 稍微降低持續時間以減少卡頓感
                easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), // 使用更簡單的緩動函數
                direction: 'vertical',
                gestureDirection: 'vertical',
                smooth: true,
                mouseMultiplier: 1.2, // 增加滑鼠滾動靈敏度
                smoothTouch: true, // 保持觸摸滑動平滑
                touchMultiplier: 3, // 增加觸摸滑動靈敏度
                normalizeWheel: true, // 標準化滑鼠滾輪行為
                touchInertiaMultiplier: 2.5, // 增加觸摸慣性，讓手機滑動更流暢
                infinite: false,
            });

            console.log('Lenis實例創建成功:', lenis);

            // 存儲 Lenis 實例以便於清理
            lenisRef.current = lenis;


            // 設置滾動事件監聽 - 減少不必要的日誌輸出
            lenis.on('scroll', (e) => {
                // 只在滾動距離明顯變化時才更新值，減少重複計算
                if (Math.abs(scrollYMotionValue.get() - e.scroll) > 0.5) {
                    scrollYMotionValue.set(e.scroll);
                    setScrollPosition(e.scroll);

                    // 根據滾動位置設置3D模式
                    const threshold = 2000;
                    const newIs3DMode = e.scroll > threshold;
                    if (is3DMode !== newIs3DMode) {
                        updateThemeColor(newIs3DMode);
                        setIs3DMode(newIs3DMode);
                    }
                }

                // 檢查是否到達底部
                if (e.scroll > 2000 && onScrollToBottom && e.direction === 1) {
                    onScrollToBottom();
                }
            });

            // 監聽滾輪事件 - 在移動設備上添加觸摸事件處理
            const handleWheel = (e) => {
                // 移除日誌輸出以減少控制台污染和性能開銷
            };

            // 添加專門的觸摸事件處理，提高移動設備上的滑動體驗
            const handleTouchStart = (e) => {
                // 記錄觸摸起始位置，但不阻止默認行為
            };

            const handleTouchMove = (e) => {
                // 確保觸摸事件可以正常傳播到Lenis
            };

            if (scrollWrapperRef.current) {
                scrollWrapperRef.current.addEventListener('wheel', handleWheel, { passive: true });
                scrollWrapperRef.current.addEventListener('touchstart', handleTouchStart, { passive: true });
                scrollWrapperRef.current.addEventListener('touchmove', handleTouchMove, { passive: true });
            }

            // Lenis 需要通過 requestAnimationFrame 來更新 - 優化RAF循環
            function raf(time) {
                lenis.raf(time);

                // 使用更高效的方式請求下一幀，不創建新的函數實例
                requestAnimationFrame(raf);
            }

            // 啟動動畫循環
            requestAnimationFrame(raf);

            // 添加鍵盤控制
            const handleKeyDown = (e) => {
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    console.log(`按下${e.key}鍵`);

                    if (e.key === 'ArrowDown') {
                        lenis.scrollTo(lenis.scroll + 100, { immediate: false, duration: 0.5 });
                    } else {
                        lenis.scrollTo(Math.max(0, lenis.scroll - 100), { immediate: false, duration: 0.5 });
                    }
                }
            };

            window.addEventListener('keydown', handleKeyDown);

            return () => {
                // 清理資源
                if (lenisRef.current) {
                    lenisRef.current.destroy();
                }
                window.removeEventListener('keydown', handleKeyDown);
                if (scrollWrapperRef.current) {
                    scrollWrapperRef.current.removeEventListener('wheel', handleWheel);
                    scrollWrapperRef.current.removeEventListener('touchstart', handleTouchStart);
                    scrollWrapperRef.current.removeEventListener('touchmove', handleTouchMove);
                }
            };
        } catch (error) {
            console.error('初始化Lenis時出錯:', error);
        }
    }, [onScrollToBottom, isMobile]);

    // 滑鼠移動的平滑追蹤 - 使用彈簧物理效果
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // 背景平滑轉換效果 - 直接在頂層使用 hook
    const skyY = useTransform(scrollYMotionValue, [0, 1600], [0, -100]);
    const mountainY = useTransform(scrollYMotionValue, [0, 1600], [-initialMountainOffset, -250 - initialMountainOffset]);
    const groundY = useTransform(scrollYMotionValue, [0, 1600], [-initialGroundOffset, -400 - initialGroundOffset]);

    // 平滑化滾動值 - 優化彈簧參數
    const smoothScrollY = useSpring(scrollYMotionValue, {
        damping: 30,       // 稍微增加阻尼以減少彈跳
        stiffness: 150,    // 增加剛性以減少延遲感
        mass: 0.8,         // 調整質量以更均衡
        restDelta: 0.001   // 精細的靜止判斷
    });

    // 背景亮度控制 - 直接在頂層使用 hook
    const skyBrightness = useTransform(scrollYMotionValue, [0, 1000], [1, 0.4]);
    const mountainBrightness = useTransform(scrollYMotionValue, [0, 1000], [1, 0.4]);
    const groundBrightness = useTransform(scrollYMotionValue, [0, 1000], [1, 0.4]);

    // 文字透明度控制 - 直接在頂層使用 hook
    const textOpacity = useTransform(scrollYMotionValue, [1200, 1600], [1, 0]);

    // 平滑化滑鼠移動 - 提高阻尼以減少抖動，限制動畫完成時間，更加流暢
    const smoothMouseX = useSpring(mouseX, {
        damping: 30,         // 降低阻尼
        stiffness: 150,      // 降低剛性以實現更自然的動畫
        mass: 0.3,           // 大幅減輕質量以實現更靈敏的反應
        restDelta: 0.001     // 更精細的靜止判斷
    });
    const smoothMouseY = useSpring(mouseY, {
        damping: 30,         // 降低阻尼
        stiffness: 150,      // 降低剛性以實現更自然的動畫
        mass: 0.3,           // 大幅減輕質量以實現更靈敏的反應
        restDelta: 0.001     // 更精細的靜止判斷
    });

    // 背景圖層移動效果 - 恢復上下左右移動
    const skyX = useTransform(smoothMouseX, [-500, 500], [-4, 4]);
    const skyYOffset = useTransform(smoothMouseY, [-500, 500], [-3, 3]);

    const mountainX = useTransform(smoothMouseX, [-500, 500], [-7, 7]);
    const mountainYOffset = useTransform(smoothMouseY, [-500, 500], [-8, 8]);

    const groundX = useTransform(smoothMouseX, [-500, 500], [-10, 10]);
    const groundYOffset = useTransform(smoothMouseY, [-500, 500], [-12, 12]);

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
            } else {
                // 當模糊動畫完成後立即標記動畫準備完成
                setAnimationsReady(true);
                // 同時立即顯示引導箭頭，不再等待文字動畫完成
                setArrowVisible(true);
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

    // 文字分割動畫效果 - 等待模糊動畫完成後再執行
    useEffect(() => {
        if (!animationsReady) return; // 等待初始動畫完成才執行文字動畫

        // 確保字體已加載
        const startTextAnimations = () => {
            if (!titleRef.current || !descRef.current) return;

            // 分割標題文字
            const { words: titleWords } = splitText(titleRef.current);

            // 分割描述文字
            const { words: descWords } = splitText(descRef.current);

            // 立即啟動標題動畫
            animate(
                titleWords,
                { opacity: [0, 1], y: [20, 0] },
                {
                    type: "spring",
                    duration: 1.2, // 進一步降低持續時間
                    bounce: 0.2,
                    delay: stagger(0.04), // 減少間隔時間
                    onComplete: () => {
                        titleAnimCompleteRef.current = true; // 標記標題動畫完成
                    }
                }
            );

            // 立即啟動描述動畫，不等待標題完成
            animate(
                descWords,
                { opacity: [0, 1], y: [15, 0] },
                {
                    type: "spring",
                    duration: 1.2, // 進一步降低持續時間
                    bounce: 0.1,
                    delay: stagger(0.02), // 減少間隔時間
                    onComplete: () => {
                        descAnimCompleteRef.current = true; // 標記描述動畫完成
                    }
                }
            );
        };

        // 嘗試立即開始動畫，如果字體還沒準備好，則等待字體
        if (document.fonts.status === 'loaded') {
            startTextAnimations();
        } else {
            document.fonts.ready.then(startTextAnimations);
        }
    }, [animationsReady]); // 依賴於animationsReady狀態

    // 使用 useCallback 優化效能
    const updateThemeColor = useCallback((is3D) => {
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
    }, []);

    // 滑鼠移動效果
    useEffect(() => {
        // 使用RAF實現持續平滑更新
        let rafId = null;
        let lastMouseX = 0;
        let lastMouseY = 0;

        // 持續更新函數
        const updateMousePosition = () => {
            // 計算相對於視窗中心的位置
            const currentX = lastMouseX - window.innerWidth / 2;
            const currentY = lastMouseY - window.innerHeight / 2;

            // 更新動作值
            mouseX.set(currentX * 0.5); // 降低視差強度以增加自然感
            mouseY.set(currentY * 0.5);

            // 繼續下一幀更新
            rafId = requestAnimationFrame(updateMousePosition);
        };

        // 滑鼠移動事件處理
        const handleMouseMove = (e) => {
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;

            if (rafId === null) {
                rafId = requestAnimationFrame(updateMousePosition);
            }
        };

        // 註冊事件
        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // 啟動持續更新
        rafId = requestAnimationFrame(updateMousePosition);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
            }
        };
    }, [mouseX, mouseY]);

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
            // 移動設備樣式
            switch (layer) {
                case 'sky':
                    return {
                        ...baseStyle,
                        top: 0,
                        height: '100vh',
                        backgroundImage: `url('/images/sky.png')`,
                        backgroundSize: 'auto 100%',
                        backgroundPosition: 'center center',
                        zIndex: 1
                    };
                case 'mountain':
                    return {
                        ...baseStyle,
                        top: -initialMountainOffset + 'px', // 明確使用像素單位
                        height: '100vh',
                        backgroundImage: `url('/images/mount.png')`,
                        backgroundSize: 'auto 100%',
                        backgroundPosition: 'center center',
                        zIndex: 2
                    };
                case 'ground':
                    return {
                        ...baseStyle,
                        top: -initialGroundOffset + 'px', // 明確使用像素單位
                        height: '100vh',
                        backgroundImage: `url('/images/ground.png')`,
                        backgroundSize: 'auto 100%',
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
                        height: '100%',
                        minHeight: '140vh', // 增加高度確保圖片顯示完整
                        backgroundImage: `url('/images/sky.png')`,
                        backgroundSize: 'cover', // 改用 cover 確保圖片填滿
                        backgroundPosition: 'center center',
                        zIndex: 1
                    };
                case 'mountain':
                    return {
                        ...baseStyle,
                        top: 0, // 移除負值偏移
                        height: '100%',
                        minHeight: '140vh', // 增加高度確保圖片顯示完整
                        backgroundImage: `url('/images/mount.png')`,
                        backgroundSize: 'cover', // 改用 cover 確保圖片填滿
                        backgroundPosition: 'center center',
                        zIndex: 2
                    };
                case 'ground':
                    return {
                        ...baseStyle,
                        top: 0, // 移除負值偏移
                        height: '100%',
                        minHeight: '140vh', // 增加高度確保圖片顯示完整
                        backgroundImage: `url('/images/ground.png')`,
                        backgroundSize: 'cover', // 改用 cover 確保圖片填滿
                        backgroundPosition: 'center center',
                        zIndex: 3
                    };
                default:
                    return baseStyle;
            }
        }
    };

    return (
        <div className="w-full h-screen overflow-hidden">
            {/* Ink Effect Mask Animation */}
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

            {/* 視差背景層 - 移動到滾動容器外部，確保不受滾動容器影響 */}
            <motion.div
                className="fixed inset-0 z-0"
                style={{
                    pointerEvents: 'none',
                    overflow: 'visible', // 確保內容不被截斷
                    height: '100vh'
                }}
            >
                {/* 天空圖層 */}
                <motion.div
                    className="absolute inset-0"
                    style={{
                        ...getBackgroundStyle('sky'),
                        y: skyY,
                        translateY: skyYOffset,
                        x: skyX,
                        filter: `brightness(${skyBrightness.get()})`,
                    }}
                />

                {/* 山脈圖層 */}
                <motion.div
                    className="absolute inset-0"
                    style={{
                        ...getBackgroundStyle('mountain'),
                        y: mountainY,
                        translateY: mountainYOffset,
                        x: mountainX,
                        filter: `brightness(${mountainBrightness.get()})`,
                    }}
                />

                {/* 地面圖層 */}
                <motion.div
                    ref={groundLayerRef}
                    className="absolute inset-0"
                    style={{
                        ...getBackgroundStyle('ground'),
                        y: groundY,
                        translateY: groundYOffset,
                        x: groundX,
                        filter: `brightness(${groundBrightness.get()})`,
                    }}
                />
            </motion.div>

            {/* 滾動容器 - 優化移動設備上的觸摸處理 */}
            <div
                ref={scrollWrapperRef}
                className="h-screen w-full overflow-hidden relative touch-auto"
                style={{
                    background: 'transparent',
                    WebkitOverflowScrolling: 'touch' // 在iOS上啟用動量滾動
                }}
            >
                {/* 滾動內容 */}
                <div
                    ref={scrollContentRef}
                    className="w-full will-change-transform"
                    style={{
                        minHeight: '500vh',
                        background: 'transparent',
                        touchAction: 'pan-y' // 明確允許垂直平移/滾動
                    }}
                >
                    {/* 填充滾動高度 - 這裡只需要提供滾動高度，不顯示任何內容 */}
                    <div className="h-[500vh] bg-transparent">
                        {/* 這裡是為了提供足夠的滾動高度 */}
                    </div>
                </div>
            </div>

            {/* 內容區塊 - 使用 Framer Motion */}
            <motion.div
                className="fixed left-0 right-0 z-30 p-4 pointer-events-none"
                style={{
                    top: '60%',
                    transform: 'translateY(-50%)',
                    opacity: textOpacity,
                    textAlign: 'center'
                }}
            >
                <div className="flex flex-col items-center justify-center">
                    <motion.h1
                        ref={titleRef}
                        className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg"
                        style={{
                            visibility: animationsReady ? "visible" : "hidden",
                            willChange: 'transform'
                        }}
                        animate={titleAnimCompleteRef.current ? {
                            scale: [1, 1.02, 1],
                        } : {}}
                        transition={titleAnimCompleteRef.current ? {
                            duration: 3,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatType: "reverse"
                        } : {}}
                    >
                        一花一世界
                    </motion.h1>
                    <motion.p
                        ref={descRef}
                        className="text-xl md:text-2xl text-white drop-shadow-md max-w-2xl mb-12"
                        style={{
                            visibility: animationsReady ? "visible" : "hidden",
                            willChange: 'transform'
                        }}
                        animate={descAnimCompleteRef.current ? {
                            scale: [1, 1.015, 1],
                        } : {}}
                        transition={descAnimCompleteRef.current ? {
                            duration: 3,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatType: "reverse",
                        } : {}}
                    >
                        我的心，為你跳動，更為這個不完美的世界燃燒
                        <br /> 我愛你，也愛這片大地和浩瀚星空
                    </motion.p>

                    {/* 引導箭頭 */}
                    <motion.div
                        ref={arrowRef}
                        className="flex flex-col items-center mt-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={arrowVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{
                            duration: 0.6,
                            ease: "easeOut",
                            type: "spring",
                            bounce: 0.3
                        }}
                    >
                        <motion.div
                            className="flex flex-col items-center"
                            animate={{ y: [0, 10, 0] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.2
                            }}
                        >
                            <span className="text-lg text-white mb-1">向下滾動</span>
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
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>

            {/* 素材資訊按鈕 */}
            <motion.button
                onClick={() => setShowCredits(true)}
                className="fixed bottom-4 right-4 z-20 p-2 bg-pink-500/30 hover:bg-pink-500/50 rounded-full border border-pink-300/50 text-white shadow-lg backdrop-blur-sm transition-all duration-300 pointer-events-auto styled-button"
                style={{ opacity: showCredits ? 0 : 1 }}
                whileTap={{ scale: 0.95 }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </motion.button>

            {/* 素材資訊彈出視窗 - 保持不變 */}
            <AnimatePresence>
                {showCredits && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowCredits(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        ></motion.div>
                        <motion.div
                            ref={modalRef}
                            className="relative bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl shadow-2xl p-6 w-full max-w-md styled-panel"
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{
                                scale: 0.9,
                                y: 20,
                                opacity: 0,
                                transition: { duration: 0.2 }
                            }}
                            transition={{ type: "spring", damping: 20 }}
                        >
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
                                <motion.div
                                    className="p-3 bg-white/80 rounded-lg backdrop-blur-sm shadow-sm"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ delay: 0.1 }}
                                >
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
                                </motion.div>

                                <motion.div
                                    className="p-3 bg-white/80 rounded-lg backdrop-blur-sm shadow-sm"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ delay: 0.2 }}
                                >
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
                                </motion.div>

                                <motion.div
                                    className="p-3 bg-white/80 rounded-lg backdrop-blur-sm shadow-sm"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ delay: 0.3 }}
                                >
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
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 文字分割動畫樣式 */}
            <style>{`
                .split-word {
                    will-change: transform, opacity;
                    display: inline-block;
                }
            `}</style>
        </div>
    );
};

// 明確命名導出組件，有助於調試
const ParallaxHomeComponent = ParallaxHome;
export default ParallaxHomeComponent; 