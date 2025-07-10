'use client'

import { ReactNode } from 'react'
import { GlobalStyles } from '@/styles/GlobalStyles'

interface StyledComponentsProviderProps {
    children: ReactNode
}

export function StyledComponentsProvider({ children }: StyledComponentsProviderProps) {
    return (
        <>
            <GlobalStyles />
            {children}
        </>
    )
} 