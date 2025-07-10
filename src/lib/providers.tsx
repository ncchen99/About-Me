'use client'

import { ApolloProvider } from '@apollo/client'
import { SessionProvider } from 'next-auth/react'
import { ApolloWrapper } from './apollo-wrapper'
import { ReactNode } from 'react'

interface ProvidersProps {
    children: ReactNode
    session?: any
}

export function Providers({ children, session }: ProvidersProps) {
    return (
        <SessionProvider session={session}>
            <ApolloWrapper>
                {children}
            </ApolloWrapper>
        </SessionProvider>
    )
} 