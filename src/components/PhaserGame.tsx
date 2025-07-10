'use client'

import { useEffect, useRef } from 'react'
import * as Phaser from 'phaser'

interface PhaserGameProps {
    width?: number
    height?: number
}

export default function PhaserGame({ width = 800, height = 600 }: PhaserGameProps) {
    const gameRef = useRef<HTMLDivElement>(null)
    const phaserGameRef = useRef<Phaser.Game | null>(null)

    useEffect(() => {
        if (gameRef.current && !phaserGameRef.current) {
            const config: Phaser.Types.Core.GameConfig = {
                type: Phaser.AUTO,
                width,
                height,
                parent: gameRef.current,
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: { x: 0, y: 300 },
                        debug: false
                    }
                },
                scene: {
                    preload: function () {
                        // 在這裡加載資源
                        console.log('Phaser 遊戲場景已載入')
                    },
                    create: function () {
                        // 在這裡創建遊戲物件
                        this.add.text(width / 2, height / 2, '歡迎來到我的個人網頁！', {
                            fontSize: '32px',
                            color: '#000'
                        }).setOrigin(0.5)
                    }
                }
            }

            phaserGameRef.current = new Phaser.Game(config)
        }

        return () => {
            if (phaserGameRef.current) {
                phaserGameRef.current.destroy(true)
                phaserGameRef.current = null
            }
        }
    }, [width, height])

    return <div ref={gameRef} className="phaser-game-container" />
} 