import styled from 'styled-components';

// 主容器
export const ParallaxContainer = styled.div`
  position: relative;
  width: 100%;
  height: 500vh;
  /* 確保容器可以被滾動 */
  overflow: visible;
  /* 確保容器有足夠的堆疊上下文 */
  z-index: 0;
`;

// 探照燈效果
export const SpotlightOverlay = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
  transition: background 0.1s ease-out;
`;

// 視差背景容器
export const ParallaxBackground = styled.div`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
`;

// 背景圖層
export const BackgroundLayer = styled.div<{ $backgroundImage: string; $zIndex: number }>`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.$backgroundImage});
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  z-index: ${props => props.$zIndex};
`;

// 內容區域
export const ContentArea = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

// 文字容器
export const TextContainer = styled.div`
  text-align: center;
  color: white;
  padding: 0 1.5rem;
`;

// 主標題
export const MainTitle = styled.h1`
  font-family: 'ChenYuluoyan', var(--font-geist-sans), sans-serif;
  font-size: 3rem;
  font-weight: 100;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 25px 25px rgba(0, 0, 0, 0.25));
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 255, 255, 0.1);

  span {
    display: inline-block;
  }

  @media (min-width: 768px) {
    font-size: 4.5rem;
  }
`;

// 副標題容器
export const SubtitleContainer = styled.div`
  font-family: 'ChenYuluoyan', var(--font-geist-sans), sans-serif;
  font-size: 1.25rem;
  font-weight: 100;
  color: #f3f4f6;
  max-width: 48rem;
  margin: 0 auto;
  line-height: 1.625;
  filter: drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1));
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);

  p {
    display: inline-block;
    margin-bottom: 0.5rem;
  }

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

// 滾動提示
export const ScrollIndicator = styled.div`
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: bounce 1s infinite;

  span {
    font-size: 1.125rem;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 0.5rem;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: rgba(255, 255, 255, 0.8);
  }

  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
      transform: translate3d(0, 0, 0);
    }
    40%, 43% {
      transform: translate3d(0, -30px, 0);
    }
    70% {
      transform: translate3d(0, -15px, 0);
    }
    90% {
      transform: translate3d(0, -4px, 0);
    }
  }
`;

// 素材資訊按鈕
export const CreditsButton = styled.button`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 20;
  padding: 0.75rem;
  background-color: rgba(236, 72, 153, 0.3);
  border: 1px solid rgba(244, 114, 182, 0.5);
  border-radius: 50%;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(4px);
  transition: all 300ms ease;
  cursor: pointer;

  &:hover {
    background-color: rgba(236, 72, 153, 0.5);
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`; 