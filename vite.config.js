import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [
        react({
            include: "**/*.{jsx,js,ts,tsx}",
            babel: {
                plugins: [
                    // 添加額外需要的 babel 插件
                ]
            }
        })
    ],
    server: {
        port: 3000,
        open: true
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true
    },
    resolve: {
        alias: {
            '@': '/src'
        }
    },
    optimizeDeps: {
        esbuildOptions: {
            loader: {
                '.js': 'jsx'
            }
        }
    }
}) 