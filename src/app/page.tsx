'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import styled from 'styled-components'
import {
  PageBackground,
  Navbar,
  NavbarContainer,
  Main,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  Grid,
  Badge
} from '@/styles/components'

// 動態載入 Phaser 組件避免 SSR 問題
const PhaserGame = dynamic(() => import('@/components/PhaserGame'), { ssr: false })

// 自定義樣式組件
const LoadingSpinner = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

const SpinnerDiv = styled.div`
  animation: spin 1s linear infinite;
  border-radius: 50%;
  height: 8rem;
  width: 8rem;
  border-bottom: 2px solid #3B82F6;
`

const NavTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
`

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const UserName = styled.span`
  color: #374151;
`

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`

const FeatureIcon = styled.div`
  flex-shrink: 0;
`

const IconBox = styled.i<{ color?: string }>`
  font-size: 3rem;
  color: ${props => props.color || '#6B7280'};
`

const FeatureContent = styled.div`
  margin-left: 0.75rem;
`

const FeatureTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  color: #111827;
`

const FeatureDescription = styled.p`
  font-size: 0.875rem;
  color: #6B7280;
`

const FeatureRow = styled.div`
  display: flex;
  align-items: center;
`

const FeatureActions = styled.div`
  margin-top: 1rem;
`

const GameContainer = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 2rem;
  animation: slideUp 0.5s ease-out;
`

const GameTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
  text-align: center;
`

const GameWrapper = styled.div`
  display: flex;
  justify-content: center;
`

const TechGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`

const TechItem = styled.div`
  text-align: center;
  padding: 1rem;
  border-radius: 0.5rem;
  transition: background-color 150ms ease-in-out;

  &:hover {
    background-color: #F9FAFB;
  }
`

const TechIcon = styled.i<{ color?: string }>`
  font-size: 3rem;
  color: ${props => props.color || '#6B7280'};
  margin-bottom: 0.5rem;
`

const TechName = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
`

export default function Home() {
  const { data: session, status } = useSession()
  const [showGame, setShowGame] = useState(false)

  if (status === 'loading') {
    return (
      <LoadingSpinner>
        <SpinnerDiv />
      </LoadingSpinner>
    )
  }

  return (
    <PageBackground>
      {/* 導航欄 */}
      <Navbar>
        <NavbarContainer>
          <NavTitle>個人介紹網頁</NavTitle>
          <UserSection>
            {session ? (
              <>
                <UserName>歡迎, {session.user?.name || session.user?.email}</UserName>
                <Button variant="danger" size="sm" onClick={() => signOut()}>
                  登出
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => signIn()}>
                登入
              </Button>
            )}
          </UserSection>
        </NavbarContainer>
      </Navbar>

      {/* 主要內容 */}
      <Main>
        <HeroSection className="animate-fade-in">
          <Heading size="4xl">歡迎來到我的個人網頁</Heading>
          <Text size="xl" color="#4B5563" style={{ marginTop: '1rem' }}>
            使用 Next.js、React、Styled-components、Firebase、GraphQL 和 Phaser 建立
          </Text>
        </HeroSection>

        {/* 功能展示區域 */}
        <Grid cols={3} gap="1.5rem" style={{ marginBottom: '2rem' }}>
          {/* 認證功能 */}
          <Card>
            <CardBody>
              <FeatureRow>
                <FeatureIcon>
                  <IconBox className='bx bx-shield' color="#22C55E" />
                </FeatureIcon>
                <FeatureContent>
                  <FeatureTitle>認證系統</FeatureTitle>
                  <FeatureDescription>NextAuth.js + Firebase</FeatureDescription>
                </FeatureContent>
              </FeatureRow>
              <FeatureActions>
                <Badge variant={session ? 'success' : 'neutral'}>
                  {session ? '已登入' : '未登入'}
                </Badge>
              </FeatureActions>
            </CardBody>
          </Card>

          {/* GraphQL */}
          <Card>
            <CardBody>
              <FeatureRow>
                <FeatureIcon>
                  <IconBox className='bx bx-data' color="#8B5CF6" />
                </FeatureIcon>
                <FeatureContent>
                  <FeatureTitle>GraphQL API</FeatureTitle>
                  <FeatureDescription>Apollo Client 整合</FeatureDescription>
                </FeatureContent>
              </FeatureRow>
              <FeatureActions>
                <Badge variant="info">已配置</Badge>
              </FeatureActions>
            </CardBody>
          </Card>

          {/* Phaser 遊戲 */}
          <Card>
            <CardBody>
              <FeatureRow>
                <FeatureIcon>
                  <IconBox className='bx bx-game' color="#3B82F6" />
                </FeatureIcon>
                <FeatureContent>
                  <FeatureTitle>互動遊戲</FeatureTitle>
                  <FeatureDescription>Phaser 3 引擎</FeatureDescription>
                </FeatureContent>
              </FeatureRow>
              <FeatureActions>
                <Button onClick={() => setShowGame(!showGame)}>
                  {showGame ? '隱藏遊戲' : '顯示遊戲'}
                </Button>
              </FeatureActions>
            </CardBody>
          </Card>
        </Grid>

        {/* Phaser 遊戲區域 */}
        {showGame && (
          <GameContainer className="animate-slide-up">
            <GameTitle>互動遊戲展示</GameTitle>
            <GameWrapper>
              <PhaserGame width={600} height={400} />
            </GameWrapper>
          </GameContainer>
        )}

        {/* 技術堆疊 */}
        <Card>
          <CardBody>
            <Heading size="2xl" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              技術堆疊
            </Heading>
            <TechGrid>
              {[
                { name: 'Next.js', icon: 'bx-react', color: '#3B82F6' },
                { name: 'Styled-components', icon: 'bx-palette', color: '#06B6D4' },
                { name: 'Firebase', icon: 'bx-data', color: '#F97316' },
                { name: 'GraphQL', icon: 'bx-code-alt', color: '#EC4899' },
                { name: 'TypeScript', icon: 'bx-code', color: '#3B82F6' },
                { name: 'Phaser', icon: 'bx-game', color: '#22C55E' },
                { name: 'NextAuth', icon: 'bx-shield', color: '#6366F1' },
                { name: 'Apollo', icon: 'bx-rocket', color: '#8B5CF6' },
              ].map((tech) => (
                <TechItem key={tech.name}>
                  <TechIcon className={`bx ${tech.icon}`} color={tech.color} />
                  <TechName>{tech.name}</TechName>
                </TechItem>
              ))}
            </TechGrid>
          </CardBody>
        </Card>
      </Main>
    </PageBackground>
  )
}
