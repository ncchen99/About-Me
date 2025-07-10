import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
})

const authLink = setContext((_, { headers }) => {
    // 從 localStorage 或其他地方獲取認證 token
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    connectToDevTools: process.env.NODE_ENV === 'development',
})

export default client 