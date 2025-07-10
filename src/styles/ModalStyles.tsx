import styled from 'styled-components';

// 模態框覆蓋層
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.7);

  .backdrop {
    position: absolute;
    inset: 0;
    backdrop-filter: blur(4px);
  }
`;

// 模態框內容
export const ModalContent = styled.div`
  position: relative;
  background: linear-gradient(to bottom right, #fdf2f8, #fce7f3);
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 1.5rem;
  width: 100%;
  max-width: 28rem;
  max-height: 80vh;
  overflow-y: auto;
`;

// 關閉按鈕
export const CloseButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  color: #ec4899;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 150ms ease;

  &:hover {
    color: #be185d;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

// 模態框標題
export const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: #db2777;
  margin-bottom: 1rem;
`;

// 內容區域
export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// 資訊卡片
export const InfoCard = styled.div`
  padding: 0.75rem;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 0.5rem;
  backdrop-filter: blur(4px);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

// 卡片標題
export const CardTitle = styled.h4<{ color?: string }>`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.color || '#374151'};
  margin-bottom: 0.5rem;
`;

// 卡片描述
export const CardDescription = styled.p`
  color: #374151;
  margin-bottom: 0.5rem;
`;

// 鏈接
export const ExternalLink = styled.a`
  color: inherit;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  transition: color 150ms ease;
  text-decoration: none;

  &:hover {
    opacity: 0.8;
  }

  svg {
    width: 1rem;
    height: 1rem;
    margin-left: 0.25rem;
  }
`;

// 小文字
export const SmallText = styled.div`
  font-size: 0.875rem;
  color: #4b5563;

  p {
    margin: 0;
  }
`; 