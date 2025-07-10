'use client';

import React from 'react';
import { gsap } from 'gsap';
import {
    ModalOverlay,
    ModalContent,
    CloseButton,
    ModalTitle,
    ModalBody,
    InfoCard,
    CardTitle,
    CardDescription,
    ExternalLink,
    SmallText
} from '@/styles/ModalStyles';

interface CreditsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreditsModal: React.FC<CreditsModalProps> = ({ isOpen, onClose }) => {
    const modalRef = React.useRef<HTMLDivElement>(null);
    const overlayRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (isOpen && modalRef.current && overlayRef.current) {
            // 進場動畫
            gsap.fromTo(overlayRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: 'power2.out' }
            );

            gsap.fromTo(modalRef.current,
                { opacity: 0, scale: 0.9, y: 20 },
                { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power3.out', delay: 0.1 }
            );
        }
    }, [isOpen]);

    const handleClose = () => {
        if (modalRef.current && overlayRef.current) {
            // 退場動畫
            gsap.to(modalRef.current,
                { opacity: 0, scale: 0.9, y: 20, duration: 0.2, ease: 'power2.in' }
            );
            gsap.to(overlayRef.current,
                {
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.in',
                    onComplete: onClose
                }
            );
        } else {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <ModalOverlay ref={overlayRef}>
            {/* 背景遮罩 */}
            <div className="backdrop" onClick={handleClose} />

            {/* 彈窗內容 */}
            <ModalContent ref={modalRef}>
                {/* 關閉按鈕 */}
                <CloseButton onClick={handleClose}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </CloseButton>

                <ModalTitle>素材來源與連結</ModalTitle>

                <ModalBody>
                    {/* 背景圖片 */}
                    <InfoCard>
                        <CardTitle color="#ec4899">背景圖片</CardTitle>
                        <CardDescription>視差滾動背景圖片素材來源</CardDescription>
                        <SmallText>
                            <p>• 天空、山脈、地面圖層</p>
                            <p>• 自然風景插畫風格</p>
                        </SmallText>
                    </InfoCard>

                    {/* GSAP 動畫庫 */}
                    <InfoCard>
                        <CardTitle color="#3b82f6">動畫技術</CardTitle>
                        <CardDescription>動畫效果使用的技術：</CardDescription>
                        <ExternalLink
                            href="https://greensock.com/gsap/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#3b82f6' }}
                        >
                            <span>GSAP (GreenSock Animation Platform)</span>
                            <svg viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </ExternalLink>
                    </InfoCard>

                    {/* Lenis 滾動庫 */}
                    <InfoCard>
                        <CardTitle color="#22c55e">平滑滾動</CardTitle>
                        <CardDescription>滾動效果使用的技術：</CardDescription>
                        <ExternalLink
                            href="https://lenis.studiofreight.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#22c55e' }}
                        >
                            <span>Lenis - Smooth Scroll Library</span>
                            <svg viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </ExternalLink>
                    </InfoCard>

                    {/* GitHub 連結 */}
                    <InfoCard>
                        <CardTitle color="#8b5cf6">源代碼</CardTitle>
                        <CardDescription>這個專案的源代碼已經在GitHub上開源：</CardDescription>
                        <ExternalLink
                            href="https://github.com/ncchen99/About-Me"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#8b5cf6' }}
                        >
                            <span>查看源代碼</span>
                            <svg viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </ExternalLink>
                    </InfoCard>
                </ModalBody>
            </ModalContent>
        </ModalOverlay>
    );
};

export default CreditsModal; 