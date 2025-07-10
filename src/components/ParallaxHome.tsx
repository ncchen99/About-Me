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

        console.log('初始化 Lenis...');

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
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // 連接 Lenis 和 ScrollTrigger
        lenis.on('scroll', (e: any) => {
            // 更新 ScrollTrigger
            ScrollTrigger.update();

            console.log('滾動位置:', e.scroll);
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

        // 測試滾動功能
        setTimeout(() => {
            console.log('Lenis 已初始化，測試滾動功能...');
            console.log('頁面高度:', document.documentElement.scrollHeight);
            console.log('視窗高度:', window.innerHeight);
            console.log('body 滾動高度:', document.body.scrollHeight);
            console.log('ParallaxContainer 元素:', containerRef.current);
            if (containerRef.current) {
                console.log('ParallaxContainer 高度:', containerRef.current.scrollHeight);
                console.log('ParallaxContainer 樣式:', window.getComputedStyle(containerRef.current).height);
            }
        }, 1000);

        // 初始化視差動畫
        const initParallaxAnimations = () => {
            // 天空層 - 最慢
            gsap.fromTo(skyRef.current,
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

            // 山脈層 - 中等速度
            gsap.fromTo(mountainRef.current,
                { yPercent: 0 },
                {
                    yPercent: -50,
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
                    yPercent: -70,
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

        return () => {
            lenis.destroy();
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
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

            {/* 滾動測試內容 - 臨時調試用 */}
            <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 100,
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '20px',
                borderRadius: '10px',
                color: 'black',
                textAlign: 'center'
            }}>
                <h3>滾動測試區域</h3>
                <p>如果你看到這個區域，說明頁面高度設置正確</p>
                <p>請嘗試向上滾動查看首頁內容</p>
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    style={{
                        padding: '10px 20px',
                        marginTop: '10px',
                        background: '#ec4899',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    滾動到頂部
                </button>
            </div>

            {/* 素材資訊彈窗 */}
            <CreditsModal
                isOpen={showCredits}
                onClose={() => setShowCredits(false)}
            />
        </ParallaxContainer>
    );
};

export default ParallaxHome; 