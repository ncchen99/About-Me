import styled from 'styled-components';

// 主頁容器
export const HomeContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: black;
  /* 允許滾動 */
  overflow-y: auto;
  overflow-x: hidden;
`;

// 關於我頁面容器
export const AboutContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #111827, #000000);
  color: white;
`;

// 內容包裝器
export const ContentWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.5rem 3rem;

  @media (max-width: 768px) {
    padding: 1.5rem 1.5rem;
  }
`;

// 標題區域
export const TitleSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

// 主標題
export const PageTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: bold;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    font-size: 3.75rem;
  }

  @media (min-width: 1024px) {
    font-size: 4rem;
  }
`;

// 副標題
export const PageSubtitle = styled.p`
  font-size: 1.25rem;
  color: #d1d5db;
  max-width: 48rem;
  margin: 0 auto;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

// 返回按鈕
export const BackButton = styled.button`
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: rgba(236, 72, 153, 0.3);
  border: 1px solid rgba(244, 114, 182, 0.5);
  border-radius: 9999px;
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

// 技能網格
export const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

// 技能卡片
export const SkillCard = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

// 技能標題
export const SkillTitle = styled.h3<{ color?: string }>`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: ${props => props.color || '#ffffff'};
`;

// 技能列表
export const SkillList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: #d1d5db;
`;

// 技能項目
export const SkillItem = styled.li`
  font-size: 1rem;
`;

// 作品展示區域
export const WorksSection = styled.div`
  text-align: center;
`;

// 作品標題
export const WorksTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 2rem;
`;

// 作品描述
export const WorksDescription = styled.p`
  color: #9ca3af;
  margin-bottom: 2rem;
`; 