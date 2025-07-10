import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                // 這裡實現您的認證邏輯
                // 可以與 Firebase Auth 或您的 GraphQL API 整合
                if (credentials?.email && credentials?.password) {
                    // 暫時返回假數據，您可以稍後實現真實的認證邏輯
                    return {
                        id: '1',
                        email: credentials.email,
                        name: 'User',
                    }
                }
                return null
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
            }
            return session
        },
    },
    pages: {
        signIn: '/auth/signin',
    },
    secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST } 