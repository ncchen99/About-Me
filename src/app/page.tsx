'use client';

import { useState } from 'react';
import ParallaxHome from '@/components/ParallaxHome';
import {
  HomeContainer,
  AboutContainer,
  ContentWrapper,
  TitleSection,
  PageTitle,
  PageSubtitle,
  BackButton,
  SkillsGrid,
  SkillCard,
  SkillTitle,
  SkillList,
  SkillItem,
  WorksSection,
  WorksTitle,
  WorksDescription
} from '@/styles/PageStyles';

export default function Home() {
  const [currentView, setCurrentView] = useState<'home' | 'dashboard'>('home');

  const handleScrollToBottom = () => {
    // 可以在這裡添加切換到其他頁面或顯示更多內容的邏輯
    setCurrentView('dashboard');
  };

  const handleReturnToHome = () => {
    setCurrentView('home');
  };

  if (currentView === 'home') {
    return (
      <HomeContainer>
        <ParallaxHome onScrollToBottom={handleScrollToBottom} />
      </HomeContainer>
    );
  }

  // 當滾動到底部時顯示的內容 (可以是原來的 dashboard 或其他內容)
  return (
    <AboutContainer>
      <ContentWrapper>
        <TitleSection>
          <PageTitle>關於我</PageTitle>
          <PageSubtitle>
            歡迎來到我的個人空間，這裡有我的故事、技能和作品
          </PageSubtitle>
        </TitleSection>

        {/* 返回首頁按鈕 */}
        <BackButton onClick={handleReturnToHome}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m7 7h18" />
          </svg>
          返回首頁
        </BackButton>

        {/* 技能展示 */}
        <SkillsGrid>
          <SkillCard>
            <SkillTitle color="#ec4899">前端開發</SkillTitle>
            <SkillList>
              <SkillItem>• React / Next.js</SkillItem>
              <SkillItem>• TypeScript</SkillItem>
              <SkillItem>• GSAP / Framer Motion</SkillItem>
              <SkillItem>• Styled Components</SkillItem>
            </SkillList>
          </SkillCard>

          <SkillCard>
            <SkillTitle color="#3b82f6">後端開發</SkillTitle>
            <SkillList>
              <SkillItem>• Node.js</SkillItem>
              <SkillItem>• GraphQL</SkillItem>
              <SkillItem>• Firebase</SkillItem>
              <SkillItem>• API 設計</SkillItem>
            </SkillList>
          </SkillCard>

          <SkillCard>
            <SkillTitle color="#f59e0b">其他技能</SkillTitle>
            <SkillList>
              <SkillItem>• 3D 開發 (Three.js)</SkillItem>
              <SkillItem>• 遊戲開發 (Phaser)</SkillItem>
              <SkillItem>• UI/UX 設計</SkillItem>
              <SkillItem>• 動畫設計</SkillItem>
            </SkillList>
          </SkillCard>
        </SkillsGrid>

        {/* 作品展示區域 */}
        <WorksSection>
          <WorksTitle>我的作品</WorksTitle>
          <WorksDescription>
            敬請期待更多精彩內容...
          </WorksDescription>
        </WorksSection>
      </ContentWrapper>
    </AboutContainer>
  );
}
