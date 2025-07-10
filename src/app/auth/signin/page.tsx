'use client'

import { signIn, getSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import { Button, Input } from '@/styles/components'

// 樣式組件
const SignInContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F9FAFB;
  padding: 3rem 1rem;

  @media (min-width: 640px) {
    padding: 3rem 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 3rem 2rem;
  }
`

const SignInCard = styled.div`
  max-width: 28rem;
  width: 100%;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 2rem;
`

const SignInTitle = styled.h2`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 1.875rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 2rem;
`

const SignInForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const InputGroup = styled.div`
  position: relative;
`

const StyledInput = styled(Input) <{ $isFirst?: boolean; $isLast?: boolean }>`
  ${props => props.$isFirst && `
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: none;
  `}
  
  ${props => props.$isLast && `
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    margin-top: -1px;
  `}
`

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`

const GoogleButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: white;
  color: #374151;
  border: 1px solid #D1D5DB;

  &:hover:not(:disabled) {
    background-color: #F9FAFB;
  }
`

const GoogleIcon = styled.i`
  font-size: 1.25rem;
`

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.ok) {
        router.push('/')
      } else {
        console.error('登入失敗')
      }
    } catch (error) {
      console.error('登入錯誤:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' })
  }

  return (
    <SignInContainer>
      <SignInCard>
        <SignInTitle>登入您的帳戶</SignInTitle>

        <SignInForm onSubmit={handleSubmit}>
          <div>
            <StyledInput
              type="email"
              required
              placeholder="電子郵件"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              $isFirst
            />
            <StyledInput
              type="password"
              required
              placeholder="密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              $isLast
            />
          </div>

          <ButtonGroup>
            <Button
              type="submit"
              disabled={loading}
              $fullWidth
            >
              {loading ? '登入中...' : '登入'}
            </Button>

            <GoogleButton
              type="button"
              onClick={handleGoogleSignIn}
              $fullWidth
            >
              <GoogleIcon className='bx bxl-google' />
              使用 Google 登入
            </GoogleButton>
          </ButtonGroup>
        </SignInForm>
      </SignInCard>
    </SignInContainer>
  )
} 