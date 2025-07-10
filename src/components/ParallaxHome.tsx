'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import CreditsModal from './CreditsModal';
import {
    ParallaxContainer,
    SpotlightOverlay,
    ParallaxBackground,
    BackgroundLayer,
    ContentArea,
    TextContainer,
    MainTitle,
    SubtitleContainer,
    ScrollIndicator,
    CreditsButton
} from '@/styles/ParallaxStyles';

// 註冊 GSAP 插件
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface ParallaxHomeProps {
    onScrollToBottom?: () => void;
}

const ParallaxHome: React.FC<ParallaxHomeProps> = ({ onScrollToBottom }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const skyRef = useRef<HTMLDivElement>(null);
    const mountainRef = useRef<HTMLDivElement>(null);
    const groundRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const subtitleRef = useRef<HTMLDivElement>(null);
    const spotlightRef = useRef<HTMLDivElement>(null);
    const lenisRef = useRef<Lenis | null>(null);

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);
    const [showCredits, setShowCredits] = useState(false);

    // 檢測設備類型
    useEffect(() => {
        const checkDevice = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkDevice();
        window.addEventListener('resize', checkDevice);

        return () => window.removeEventListener('resize', checkDevice);
    }, []);

    // 初始化 Lenis 和 GSAP 動畫
    useEffect(() => {
        if (typeof window === 'undefined') return;

        let rafId: number;
        let timeoutId: NodeJS.Timeout;

        // 強制重置所有滾動相關狀態
        const resetScrollState = () => {
            // 清理可能存在的舊實例
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            ScrollTrigger.clearScrollMemory();

            // 確保頁面滾動到頂部
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            window.scrollTo(0, 0);

            // 重置 body 樣式，確保可滾動
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';
        };

        // 延遲初始化，確保組件完全掛載
        timeoutId = setTimeout(() => {
            resetScrollState();

            // 初始化 Lenis
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 2,
                infinite: false,
            });

            lenisRef.current = lenis;

            // RAF 循環
            function raf(time: number) {
                if (lenisRef.current) {
                    lenisRef.current.raf(time);
                    rafId = requestAnimationFrame(raf);
                }
            }
            rafId = requestAnimationFrame(raf);

            // 連接 Lenis 和 ScrollTrigger
            lenis.on('scroll', (e: any) => {
                // 更新 ScrollTrigger
                ScrollTrigger.update();

                if (e.scroll > 2000 && onScrollToBottom) {
                    onScrollToBottom();
                }
            });

            // 讓 ScrollTrigger 使用 Lenis 的滾動數據
            ScrollTrigger.scrollerProxy(document.body, {
                scrollTop(value) {
                    if (arguments.length && value !== undefined) {
                        lenis.scrollTo(value, { immediate: true });
                    }
                    return lenis.animatedScroll;
                },
                getBoundingClientRect() {
                    return {
                        top: 0,
                        left: 0,
                        width: window.innerWidth,
                        height: window.innerHeight
                    };
                }
            });

            // 當 ScrollTrigger 刷新時，也刷新 Lenis
            ScrollTrigger.addEventListener('refresh', () => lenis.resize());

            // 初始化視差動畫
            const initParallaxAnimations = () => {
                // 天空層 - 最慢
                gsap.fromTo(skyRef.current,
                    { yPercent: 0 },
                    {
                        yPercent: -10,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true
                        }
                    }
                );

                // 山脈層 - 中等速度
                gsap.fromTo(mountainRef.current,
                    { yPercent: 0 },
                    {
                        yPercent: -20,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true
                        }
                    }
                );

                // 地面層 - 最快
                gsap.fromTo(groundRef.current,
                    { yPercent: 0 },
                    {
                        yPercent: -30,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true
                        }
                    }
                );

                // 文字淡出效果
                gsap.fromTo([titleRef.current, subtitleRef.current],
                    { opacity: 1, y: 0 },
                    {
                        opacity: 0,
                        y: -100,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: 'top top',
                            end: '50% top',
                            scrub: true
                        }
                    }
                );

                // 文字進場動畫
                if (titleRef.current?.children) {
                    gsap.fromTo(titleRef.current.children,
                        {
                            opacity: 0,
                            y: 50,
                            scale: 0.8,
                            rotationX: -90
                        },
                        {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            rotationX: 0,
                            duration: 1.5,
                            stagger: 0.15,
                            ease: 'power3.out',
                            delay: 0.5
                        }
                    );
                }

                if (subtitleRef.current?.children) {
                    gsap.fromTo(subtitleRef.current.children,
                        {
                            opacity: 0,
                            y: 30,
                            scale: 0.9
                        },
                        {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 1.2,
                            stagger: 0.02,
                            ease: 'power2.out',
                            delay: 1.0
                        }
                    );
                }
            };

            // 初始化動畫之前，先刷新 ScrollTrigger
            ScrollTrigger.refresh();

            // 等待一幀再初始化動畫，確保 DOM 已準備好
            gsap.delayedCall(0.1, () => {
                initParallaxAnimations();
                // 再次刷新 ScrollTrigger 確保所有動畫正確註冊
                ScrollTrigger.refresh();
            });
        }, 100);

        return () => {
            // 清理計時器
            if (timeoutId) clearTimeout(timeoutId);
            if (rafId) cancelAnimationFrame(rafId);

            // 完整清理 Lenis
            if (lenisRef.current) {
                lenisRef.current.destroy();
                lenisRef.current = null;
            }

            // 清理所有 ScrollTrigger
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            ScrollTrigger.refresh();

            // 重置滾動位置
            window.scrollTo(0, 0);
        };
    }, [onScrollToBottom]);

    // 滑鼠移動效果
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = e.clientX;
            const y = e.clientY;

            setMousePosition({ x, y });

            // 更新探照燈位置
            if (spotlightRef.current) {
                spotlightRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, transparent 0%, rgba(0, 0, 0, 0.15) 40%, rgba(0, 0, 0, 0.4) 100%)`;
            }

            // 標題微微跟隨滑鼠
            if (titleRef.current && !isMobile) {
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                const moveX = (x - centerX) * 0.02;
                const moveY = (y - centerY) * 0.02;

                gsap.to(titleRef.current, {
                    x: moveX,
                    y: moveY,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            }

            if (subtitleRef.current && !isMobile) {
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                const moveX = (x - centerX) * 0.015;
                const moveY = (y - centerY) * 0.015;

                gsap.to(subtitleRef.current, {
                    x: moveX,
                    y: moveY,
                    duration: 0.8,
                    ease: 'power2.out'
                });
            }
        };

        if (!isMobile) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isMobile]);

    return (
        <ParallaxContainer ref={containerRef}>
            {/* 探照燈效果 */}
            <SpotlightOverlay
                ref={spotlightRef}
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, rgba(0, 0, 0, 0.15) 40%, rgba(0, 0, 0, 0.4) 100%)`
                }}
            />

            {/* 視差背景層 */}
            <ParallaxBackground>
                {/* 天空層 */}
                <BackgroundLayer
                    ref={skyRef}
                    $backgroundImage="/images/sky.png"
                    $zIndex={1}
                />

                {/* 山脈層 */}
                <BackgroundLayer
                    ref={mountainRef}
                    $backgroundImage="/images/mount.png"
                    $zIndex={2}
                />

                {/* 地面層 */}
                <BackgroundLayer
                    ref={groundRef}
                    $backgroundImage="/images/ground.png"
                    $zIndex={3}
                />
            </ParallaxBackground>

            {/* 內容區域 */}
            <ContentArea>
                <TextContainer>
                    <MainTitle ref={titleRef}>
                        <span>一</span>
                        <span>花</span>
                        <span>一</span>
                        <span>世</span>
                        <span>界</span>
                    </MainTitle>

                    <SubtitleContainer ref={subtitleRef}>
                        <p>我的心，為你跳動，更為這個不完美的世界燃燒</p>
                        <br />
                        <p>我愛你，也愛這片大地和浩瀚星空</p>
                    </SubtitleContainer>

                    {/* 滾動提示 */}
                    <ScrollIndicator>
                        <span>向下滾動</span>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </ScrollIndicator>
                </TextContainer>
            </ContentArea>

            {/* 素材資訊按鈕 */}
            <CreditsButton onClick={() => setShowCredits(true)}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </CreditsButton>

            {/* 素材資訊彈窗 */}
            <CreditsModal
                isOpen={showCredits}
                onClose={() => setShowCredits(false)}
            />
        </ParallaxContainer>
    );
};

export default ParallaxHome; 