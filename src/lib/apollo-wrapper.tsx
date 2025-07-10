'use client'

import { ApolloNextAppProvider } from '@apollo/experimental-nextjs-app-support'
import { makeClient } from '@/lib/apollo-client'
import { ReactNode } from 'react'

interface ApolloWrapperProps {
    children: ReactNode
}

export function ApolloWrapper({ children }: ApolloWrapperProps) {
    return (
        <ApolloNextAppProvider makeClient={makeClient as any}>
            {children}
        </ApolloNextAppProvider>
    )
} 