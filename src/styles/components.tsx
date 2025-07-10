import styled, { css } from 'styled-components'

// 容器組件
export const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`

// 按鈕組件
interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean
    disabled?: boolean
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 150ms ease-in-out;
  cursor: pointer;
  border: none;
  outline: none;

  ${props => {
        switch (props.size) {
            case 'sm':
                return css`
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          height: 2rem;
        `
            case 'lg':
                return css`
          padding: 0.75rem 2rem;
          font-size: 1.125rem;
          height: 3rem;
        `
            default:
                return css`
          padding: 0.625rem 1.5rem;
          font-size: 1rem;
          height: 2.5rem;
        `
        }
    }}

  ${props => {
        switch (props.variant) {
            case 'secondary':
                return css`
          background-color: #F3F4F6;
          color: #374151;
          border: 1px solid #D1D5DB;
          
          &:hover:not(:disabled) {
            background-color: #E5E7EB;
          }
        `
            case 'danger':
                return css`
          background-color: #DC2626;
          color: white;
          
          &:hover:not(:disabled) {
            background-color: #B91C1C;
          }
        `
            case 'ghost':
                return css`
          background-color: transparent;
          color: #374151;
          border: 1px solid #D1D5DB;
          
          &:hover:not(:disabled) {
            background-color: #F9FAFB;
          }
        `
            default:
                return css`
          background-color: #3B82F6;
          color: white;
          
          &:hover:not(:disabled) {
            background-color: #2563EB;
          }
        `
        }
    }}

  ${props => props.fullWidth && css`
    width: 100%;
  `}

  ${props => props.disabled && css`
    opacity: 0.5;
    cursor: not-allowed;
  `}
`

// 卡片組件
export const Card = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
`

export const CardBody = styled.div`
  padding: 1.5rem;
`

// 輸入框組件
export const Input = styled.input`
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 150ms ease-in-out;

  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9CA3AF;
  }
`

// 標題組件
export const Heading = styled.h1<{ size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' }>`
  font-weight: 800;
  line-height: 1.2;
  color: #111827;

  ${props => {
        switch (props.size) {
            case 'sm':
                return css`font-size: 1.125rem;`
            case 'md':
                return css`font-size: 1.25rem;`
            case 'lg':
                return css`font-size: 1.5rem;`
            case 'xl':
                return css`font-size: 1.875rem;`
            case '2xl':
                return css`font-size: 2.25rem;`
            case '3xl':
                return css`font-size: 3rem;`
            case '4xl':
                return css`font-size: 3.75rem;`
            case '5xl':
                return css`font-size: 4.5rem;`
            default:
                return css`font-size: 2.25rem;`
        }
    }}

  @media (min-width: 640px) {
    ${props => {
        switch (props.size) {
            case '2xl':
                return css`font-size: 3rem;`
            case '3xl':
                return css`font-size: 3.75rem;`
            case '4xl':
                return css`font-size: 4.5rem;`
            case '5xl':
                return css`font-size: 6rem;`
            default:
                return ''
        }
    }}
  }
`

// 文字組件
export const Text = styled.p<{ size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'; color?: string }>`
  line-height: 1.6;
  
  ${props => {
        switch (props.size) {
            case 'xs':
                return css`font-size: 0.75rem;`
            case 'sm':
                return css`font-size: 0.875rem;`
            case 'lg':
                return css`font-size: 1.125rem;`
            case 'xl':
                return css`font-size: 1.25rem;`
            default:
                return css`font-size: 1rem;`
        }
    }}

  ${props => props.color && css`color: ${props.color};`}
`

// 狀態標籤組件
export const Badge = styled.span<{ variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;

  ${props => {
        switch (props.variant) {
            case 'success':
                return css`
          background-color: #DCFCE7;
          color: #166534;
        `
            case 'warning':
                return css`
          background-color: #FEF3C7;
          color: #92400E;
        `
            case 'danger':
                return css`
          background-color: #FEE2E2;
          color: #991B1B;
        `
            case 'info':
                return css`
          background-color: #DBEAFE;
          color: #1E40AF;
        `
            default:
                return css`
          background-color: #F3F4F6;
          color: #374151;
        `
        }
    }}
`

// 格線布局
export const Grid = styled.div<{ cols?: number; gap?: string }>`
  display: grid;
  gap: ${props => props.gap || '1.5rem'};
  grid-template-columns: repeat(1, minmax(0, 1fr));

  @media (min-width: 768px) {
    grid-template-columns: repeat(${props => Math.min(props.cols || 2, 2)}, minmax(0, 1fr));
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(${props => props.cols || 3}, minmax(0, 1fr));
  }
`

// 導航欄
export const Navbar = styled.nav`
  background: white;
  border-bottom: 1px solid #E5E7EB;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`

export const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`

// 主要內容區域
export const Main = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.5rem 1rem;

  @media (min-width: 640px) {
    padding: 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 2rem;
  }
`

// 頁面背景
export const PageBackground = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #EFF6FF 0%, #E0E7FF 100%);
` 