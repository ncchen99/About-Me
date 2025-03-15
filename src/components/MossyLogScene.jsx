import React, { Suspense, useRef, useMemo, useEffect, useCallback, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, useTexture } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import Loader from './Loader';


// 創建螢火蟲粒子系統 - 完全重構版本
const GlowingParticles = React.memo(function GlowingParticles({ maxCount = 200, color = '#ffed97', size = 0.02 }) {
    // 基本引用和狀態
    const groupRef = useRef();
    const light = useRef();
    const { raycaster, camera, mouse } = useThree();
    const [isInitialized, setIsInitialized] = React.useState(false);
    const particles = useRef([]);

    // 追蹤粒子數據的狀態
    const particlePool = useRef([]);
    // 保存被點擊的粒子歷史記錄
    const clickHistory = useRef({});

    // 使用 useMemo 為粒子池創建初始數據，這樣只會在 maxCount 改變時重新計算
    const initialParticleData = useMemo(() => {
        console.log('初始化粒子池數據');
        const temp = [];
        for (let i = 0; i < maxCount; i++) {
            temp.push({
                position: [0, 0, 0],
                scale: Math.random() * 0.5 + 0.5,
                speed: Math.random() * 0.2 + 0.1,
                timeOffset: Math.random() * 100,
                lifespan: Math.random() * 8 + 5, // 5-13秒的生命週期
                active: false,
                age: 0,
                baseIntensity: Math.random() * 0.5 + 0.5, // 基礎亮度變化
                pulseFactor: Math.random() * 0.15 + 0.1,  // 脈動強度
                pulseSpeed: Math.random() * 2 + 1, // 脈動速度
                lastClickTime: 0,
                // 移動相關參數
                velocity: [0, 0, 0],
                targetPosition: [0, 0, 0],
                changeDirectionTime: 0,
                directionChangeInterval: Math.random() * 3 + 2, // 2-5秒改變一次方向
                isFromClick: false // 標記是否來自點擊
            });
        }
        return temp;
    }, [maxCount]);

    // 組件掛載和卸載時的生命週期管理
    useEffect(() => {
        console.log('GlowingParticles 組件已掛載');
        particlePool.current = [...initialParticleData];

        // 清理函數 - 組件卸載時
        return () => {
            console.log('GlowingParticles 組件即將卸載');
            setIsInitialized(false);
            particlePool.current = [];
            particles.current = [];
            clickHistory.current = {};
        };
    }, [initialParticleData]);

    // 在組件引用準備好後標記為已初始化
    useEffect(() => {
        const checkReady = () => {
            if (groupRef.current) {
                console.log('GlowingParticles 組件引用已準備好');
                setIsInitialized(true);
                return true;
            }
            return false;
        };

        // 立即檢查
        const isReady = checkReady();

        // 如果沒有準備好，設置一個延遲檢查
        if (!isReady) {
            const timer = setTimeout(() => {
                if (!isInitialized) {
                    const secondCheck = checkReady();
                    console.log('延遲初始化檢查:', secondCheck ? '成功' : '失敗');
                }
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [isInitialized]);

    // 創建粒子的函數 - 使用 useCallback 以避免不必要的重新創建
    const createParticlesAtPosition = useCallback((position, count = 5) => {
        if (!isInitialized || !particlePool.current) {
            console.warn('粒子系統尚未初始化，無法創建粒子');
            return;
        }

        try {
            // 尋找非活躍粒子用於生成新的粒子效果
            let createdCount = 0;
            for (let i = 0; i < particlePool.current.length && createdCount < count; i++) {
                if (!particlePool.current[i].active) {
                    // 設置爆發粒子
                    particlePool.current[i].active = true;
                    particlePool.current[i].position = [...position];
                    particlePool.current[i].age = 0;
                    particlePool.current[i].lifespan = Math.random() * 3 + 2; // 較短壽命
                    particlePool.current[i].isFromClick = true; // 標記為點擊產生

                    // 定義爆發方向 - 從點擊位置發散
                    const angle = Math.random() * Math.PI * 2;
                    const upwardBias = Math.random() * 0.5 + 0.5; // 偏向上方

                    particlePool.current[i].velocity = [
                        Math.cos(angle) * (Math.random() * 0.02 + 0.01),
                        upwardBias * (Math.random() * 0.02 + 0.01),
                        Math.sin(angle) * (Math.random() * 0.02 + 0.01)
                    ];

                    // 給予更亮的初始強度
                    particlePool.current[i].baseIntensity = Math.random() * 0.8 + 0.7;
                    particlePool.current[i].pulseFactor = Math.random() * 0.2 + 0.2;

                    createdCount++;
                }
            }
            console.log(`已在位置 (${position.join(', ')}) 創建 ${createdCount} 個粒子`);
        } catch (error) {
            console.error('創建粒子時發生錯誤:', error);
        }
    }, [isInitialized]);

    // 監聽木頭點擊事件 - 使用 useEffect 註冊全局事件
    useEffect(() => {
        if (!isInitialized) return;

        // 創建木頭點擊事件的監聽器
        const handleLogClick = (event) => {
            if (event.detail && event.detail.position && Array.isArray(event.detail.position)) {
                try {
                    createParticlesAtPosition(event.detail.position, 8); // 產生8個螢火蟲粒子
                } catch (error) {
                    console.error('處理木頭點擊事件時發生錯誤:', error);
                }
            }
        };

        console.log('添加木頭點擊事件監聽器');
        window.addEventListener('log-clicked', handleLogClick);

        // 清理函數
        return () => {
            console.log('移除木頭點擊事件監聽器');
            window.removeEventListener('log-clicked', handleLogClick);
        };
    }, [isInitialized, createParticlesAtPosition]); // 移除 textures 相關的依賴

    // 更新粒子 - 使用 useFrame 來實現動畫
    useFrame(({ clock }) => {
        try {
            if (!isInitialized || !groupRef.current) return;
            const elapsedTime = clock.getElapsedTime();
            const particleMeshes = groupRef.current?.children || [];
            if (particleMeshes.length <= 1) return;
            particles.current = particleMeshes.slice(1);

            // 計算當前活躍的粒子數量
            const activeCount = particlePool.current.filter(p => p.active).length;

            // 如果活躍粒子較少，隨機激活新粒子
            if (Math.random() < 0.1 && activeCount < maxCount) {
                // 尋找一個非活躍粒子
                for (let i = 0; i < particlePool.current.length; i++) {
                    if (!particlePool.current[i].active) {
                        // 生成合理的啟動位置 - 較大範圍內的隨機位置
                        const radius = 2.5 + Math.random() * 2; // 更大的生成範圍
                        const theta = Math.random() * Math.PI * 2;
                        const phi = Math.random() * Math.PI - Math.PI / 2;
                        const x = radius * Math.cos(theta) * Math.cos(phi);
                        const y = Math.max(0, radius * Math.sin(phi) + Math.random() * 1.5 - 0.5);
                        const z = radius * Math.sin(theta) * Math.cos(phi);
                        // 激活粒子
                        particlePool.current[i].active = true;
                        particlePool.current[i].position = [x, y, z];
                        particlePool.current[i].targetPosition = [
                            x + (Math.random() - 0.5) * 1.5,
                            y + (Math.random() - 0.5) * 1.5,
                            z + (Math.random() - 0.5) * 1.5
                        ];
                        particlePool.current[i].age = 0;
                        particlePool.current[i].changeDirectionTime = elapsedTime;
                        particlePool.current[i].velocity = [
                            (Math.random() - 0.5) * 0.01,
                            (Math.random() - 0.5) * 0.01,
                            (Math.random() - 0.5) * 0.01
                        ];
                        particlePool.current[i].isFromClick = false; // 標記為非點擊產生
                        // 設置一個新的生命週期
                        particlePool.current[i].lifespan = Math.random() * 8 + 5;
                        break;
                    }
                }
            }

            // 更新粒子狀態和外觀
            for (let i = 0; i < particlePool.current.length; i++) {
                const particleData = particlePool.current[i];
                const particleMesh = particles.current[i];

                // 跳過非活躍粒子或無效網格
                if (!particleData || !particleData.active || !particleMesh) continue;

                // 增加粒子年齡
                particleData.age += 0.016; // 約60FPS的增量

                // 檢查粒子是否超過生命週期
                if (particleData.age >= particleData.lifespan) {
                    particleData.active = false;
                    if (particleMesh) {
                        particleMesh.visible = false;
                    }
                    continue;
                }

                // 確保粒子可見
                particleMesh.visible = true;

                // 計算生命週期階段 (0-1)
                const lifeProgress = particleData.age / particleData.lifespan;

                // 根據生命週期階段計算透明度 - 緩慢淡入淡出
                let opacity = 1;
                if (lifeProgress < 0.1) { // 淡入
                    opacity = lifeProgress * 10;
                } else if (lifeProgress > 0.9) { // 淡出
                    opacity = (1 - lifeProgress) * 10;
                }

                // 計算脈動效果
                const pulse = Math.sin(elapsedTime * particleData.pulseSpeed + particleData.timeOffset) *
                    particleData.pulseFactor + particleData.baseIntensity;

                // 更新材質
                if (particleMesh.material) {
                    particleMesh.material.opacity = opacity * pulse * 0.7;
                    particleMesh.material.emissiveIntensity = pulse * 0.5;
                }

                // 更新位置 - 根據粒子類型
                if (particleData.isFromClick) {
                    // 從點擊產生的粒子 - 向外擴散並上升
                    particleData.position[0] += particleData.velocity[0] * (1 - lifeProgress * 0.5);
                    particleData.position[1] += particleData.velocity[1] * (1 - lifeProgress * 0.5);
                    particleData.position[2] += particleData.velocity[2] * (1 - lifeProgress * 0.5);
                } else {
                    // 常規飄浮粒子 - 更自然的移動
                    // 每隔一段時間改變方向
                    if (elapsedTime - particleData.changeDirectionTime > particleData.directionChangeInterval) {
                        // 設置新的目標位置 - 相對於當前位置的偏移
                        particleData.targetPosition = [
                            particleData.position[0] + (Math.random() - 0.5) * 1.5,
                            Math.max(0.2, particleData.position[1] + (Math.random() - 0.5) * 1.5), // 避免太低
                            particleData.position[2] + (Math.random() - 0.5) * 1.5
                        ];
                        particleData.changeDirectionTime = elapsedTime;
                    }

                    // 計算向目標位置的向量
                    const toTarget = [
                        particleData.targetPosition[0] - particleData.position[0],
                        particleData.targetPosition[1] - particleData.position[1],
                        particleData.targetPosition[2] - particleData.position[2]
                    ];

                    // 計算距離
                    const distance = Math.sqrt(toTarget[0] ** 2 + toTarget[1] ** 2 + toTarget[2] ** 2);

                    // 如果接近目標，設置新目標
                    if (distance < 0.1) {
                        particleData.targetPosition = [
                            particleData.position[0] + (Math.random() - 0.5) * 1.5,
                            Math.max(0.2, particleData.position[1] + (Math.random() - 0.5) * 1.5),
                            particleData.position[2] + (Math.random() - 0.5) * 1.5
                        ];
                        particleData.changeDirectionTime = elapsedTime;
                    } else {
                        // 計算單位向量
                        const normalizedVector = [
                            toTarget[0] / distance,
                            toTarget[1] / distance,
                            toTarget[2] / distance
                        ];

                        // 平滑地改變速度 - 添加一些加速度
                        particleData.velocity[0] += normalizedVector[0] * 0.0005;
                        particleData.velocity[1] += normalizedVector[1] * 0.0005;
                        particleData.velocity[2] += normalizedVector[2] * 0.0005;

                        // 添加阻力和速度限制
                        const maxSpeed = 0.015;
                        const currentSpeed = Math.sqrt(
                            particleData.velocity[0] ** 2 +
                            particleData.velocity[1] ** 2 +
                            particleData.velocity[2] ** 2
                        );

                        if (currentSpeed > maxSpeed) {
                            particleData.velocity[0] = (particleData.velocity[0] / currentSpeed) * maxSpeed;
                            particleData.velocity[1] = (particleData.velocity[1] / currentSpeed) * maxSpeed;
                            particleData.velocity[2] = (particleData.velocity[2] / currentSpeed) * maxSpeed;
                        }

                        // 添加隨機擾動
                        particleData.velocity[0] += (Math.random() - 0.5) * 0.0005;
                        particleData.velocity[1] += (Math.random() - 0.5) * 0.0005;
                        particleData.velocity[2] += (Math.random() - 0.5) * 0.0005;

                        // 更新位置
                        particleData.position[0] += particleData.velocity[0];
                        particleData.position[1] += particleData.velocity[1];
                        particleData.position[2] += particleData.velocity[2];
                    }
                }

                // 更新粒子網格位置
                if (particleMesh.position) {
                    particleMesh.position.set(
                        particleData.position[0],
                        particleData.position[1],
                        particleData.position[2]
                    );
                }
            }

            // 更新中心光源強度
            if (light.current) {
                light.current.intensity = (Math.sin(elapsedTime * 0.3) + 1.5) * 0.5;
            }
        } catch (error) {
            console.error('更新粒子時發生錯誤:', error);
        }
    });

    // 處理粒子點擊
    const handleClick = useCallback((event) => {
        event.stopPropagation();

        try {
            // 確保引用有效
            if (!groupRef.current || !Array.isArray(particles.current) || particles.current.length === 0) {
                return;
            }

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(particles.current);

            if (intersects.length > 0) {
                const clickedParticle = intersects[0].object;
                const now = Date.now();
                const particleIndex = particles.current.indexOf(clickedParticle);

                if (particleIndex >= 0 && particleIndex < particlePool.current.length) {
                    const particleData = particlePool.current[particleIndex];

                    // 防止頻繁點擊
                    if (now - (clickHistory.current[particleIndex] || 0) > 300) {
                        // 播放粒子音效
                        if (window.audioManager) {
                            window.audioManager.playSound('particle-click');
                        }

                        // 閃爍效果 - 安全地應用
                        if (clickedParticle && clickedParticle.scale) {
                            clickedParticle.scale.multiplyScalar(3);

                            if (clickedParticle.material) {
                                const originalColor = clickedParticle.material.color.clone();
                                clickedParticle.material.color.set('#ffffff');
                                clickedParticle.material.opacity = 1;

                                // 創建爆炸效果 - 產生額外粒子
                                const explosionCount = 3; // 減少數量以提高性能
                                for (let i = 0; i < explosionCount; i++) {
                                    // 找到一個非活躍粒子
                                    const inactiveIndex = particlePool.current.findIndex(p => !p.active && particlePool.current.indexOf(p) !== particleIndex);
                                    if (inactiveIndex !== -1) {
                                        // 設置爆炸粒子
                                        particlePool.current[inactiveIndex].active = true;
                                        particlePool.current[inactiveIndex].position = [...particleData.position];
                                        particlePool.current[inactiveIndex].age = 0;
                                        particlePool.current[inactiveIndex].lifespan = 1; // 短壽命

                                        // 爆炸方向
                                        const explosionAngle = (Math.PI * 2 / explosionCount) * i;
                                        particlePool.current[inactiveIndex].velocity = [
                                            Math.cos(explosionAngle) * 0.05,
                                            Math.sin(explosionAngle) * 0.05,
                                            (Math.random() - 0.5) * 0.05
                                        ];
                                    }
                                }

                                // 安全地恢復原始狀態
                                setTimeout(() => {
                                    try {
                                        if (clickedParticle && clickedParticle.scale) {
                                            clickedParticle.scale.divideScalar(3);
                                            if (clickedParticle.material) {
                                                clickedParticle.material.color.copy(originalColor);
                                            }
                                        }
                                    } catch (error) {
                                        console.error('恢復粒子狀態時出錯:', error);
                                    }
                                }, 300);
                            }
                        }

                        // 更新點擊歷史
                        clickHistory.current[particleIndex] = now;
                    }
                }
            }
        } catch (error) {
            console.error('處理粒子點擊時發生錯誤:', error);
        }
    }, [raycaster, camera, mouse]);

    // 使用數據渲染實際的粒子
    return (
        <group ref={groupRef} onClick={handleClick}>
            {/* 中心光源 */}
            <pointLight
                ref={light}
                position={[0, 0, 0]}
                color={color}
                intensity={1}
                distance={10}
                decay={2}
            />

            {/* 預先創建所有可能的粒子 */}
            {initialParticleData.map((data, i) => (
                <mesh
                    key={i}
                    position={data.position}
                    visible={false} // 初始不可見
                >
                    <sphereGeometry args={[size * data.scale, 6, 6]} />
                    <meshStandardMaterial
                        color={color}
                        transparent={true}
                        opacity={0.7}
                        emissive={color}
                        emissiveIntensity={0.5}
                    />
                </mesh>
            ))}
        </group>
    );
});

// 創建模型加載器組件
function MossyLogModel() {
    const groupRef = useRef();
    const [model, setModel] = React.useState(null);

    // 直接在函數組件頂層調用 useTexture Hook
    const textureProps = useTexture({
        groundBaseColor: '/assets/mossy-log/textures/ground_baseColor.png',
        mushroomsBaseColor: '/assets/mossy-log/textures/mushrooms_and_rock_baseColor.png',
        mushroomsNormal: '/assets/mossy-log/textures/mushrooms_and_rock_normal.png',
        material001BaseColor: '/assets/mossy-log/textures/Material.001_baseColor.png',
        material001Normal: '/assets/mossy-log/textures/Material.001_normal.png',
        materialBaseColor: '/assets/mossy-log/textures/material_baseColor.png',
        materialNormal: '/assets/mossy-log/textures/material_normal.png'
    });

    // 使用 useMemo 包裝已獲取的紋理，確保紋理引用的穩定性
    const textures = useMemo(() => textureProps, [textureProps]);

    // 配置材質，使其適用於Three.js的標準材質
    React.useEffect(() => {
        console.log('設置紋理屬性 - 只執行一次');
        Object.values(textures).forEach(texture => {
            if (texture) {
                texture.flipY = false; // GLTF 模型通常需要設置 flipY 為 false
                texture.colorSpace = THREE.SRGBColorSpace;
            }
        });
    }, [textures]); // 添加 textures 依賴項

    // 處理模型點擊事件
    const handleModelClick = (event) => {
        event.stopPropagation();

        // 檢查點擊的是哪個部分
        if (event.object && window.audioManager) {
            const name = event.object.name.toLowerCase() || '';
            console.log('點擊了模型部分:', name);

            // 根據模型實際結構判斷點擊的部分
            if (name.includes('ground')) {
                window.audioManager.playSound('ground-step');
            } else if (name.includes('mushroom') || name.includes('rock')) {
                window.audioManager.playSound('mushroom-squish');
            } else if (name.includes('material.001')) {
                // 可能是花朵或植物
                window.audioManager.playSound('flower-rustle');
            } else {
                // 默認為木頭
                window.audioManager.playSound('wood-knock');
            }

            // 觸發木頭點擊事件，傳遞點擊位置以創建螢火蟲
            const clickEvent = new CustomEvent('log-clicked', {
                detail: {
                    position: [
                        event.point.x,
                        event.point.y,
                        event.point.z
                    ]
                }
            });
            window.dispatchEvent(clickEvent);
        }
    };

    // 加載GLTF模型
    React.useEffect(() => {
        // 防止多次加載
        let isMounted = true;

        // 如果模型已加載，不再重複加載
        if (model !== null) {
            console.log('模型已經加載，跳過重複加載');
            return;
        }

        const loader = new GLTFLoader();

        // 設置載入進度回調（修改以防止 Infinity）
        const onProgress = (xhr) => {
            if (xhr.lengthComputable && xhr.total > 0) {
                const percentage = (xhr.loaded / xhr.total * 100).toFixed(2);
                console.log(`模型載入進度: ${percentage}%`);
            } else {
                console.log(`模型載入中...已加載 ${Math.floor(xhr.loaded / 1024)} KB`);
            }
        };

        // 模型路徑嘗試列表
        const possiblePaths = [
            // 直接使用正確的路徑 - 從檔案結構可知這些檔案確實存在
            '/assets/mossy-log/scene.gltf',
            'assets/mossy-log/scene.gltf'
        ];

        // 嘗試加載模型函數
        const attemptLoadModel = (pathIndex) => {
            if (!isMounted) return; // 如果組件已卸載，停止加載

            if (pathIndex >= possiblePaths.length) {
                console.error('所有模型路徑嘗試失敗 - 創建備用模型');
                // 創建一個簡單的備用模型
                const geometry = new THREE.BoxGeometry(1, 0.5, 2);
                const fallbackMaterial = new THREE.MeshStandardMaterial({
                    color: 0x6d5c45,
                    roughness: 0.8,
                    metalness: 0.2,
                    emissive: new THREE.Color(0xffe680),
                    emissiveIntensity: 0.8 // 增強發光效果
                });
                const fallbackModel = new THREE.Mesh(geometry, fallbackMaterial);
                fallbackModel.position.set(0, -0.75, 0);
                fallbackModel.castShadow = true;
                fallbackModel.receiveShadow = true;
                fallbackModel.name = "fallback_log";

                // 創建一個場景
                const scene = new THREE.Scene();
                scene.add(fallbackModel);

                // 添加一些簡單的蘑菇和花朵
                const mushroom = new THREE.Group();

                const stem = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.05, 0.07, 0.2, 8),
                    new THREE.MeshStandardMaterial({
                        color: 0xffeaaa,
                        roughness: 0.9,
                        emissive: new THREE.Color(0xf7e8c2),
                        emissiveIntensity: 0.1
                    })
                );
                stem.position.y = 0.1;

                const cap = new THREE.Mesh(
                    new THREE.SphereGeometry(0.15, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
                    new THREE.MeshStandardMaterial({
                        color: 0xffd485,
                        roughness: 0.8,
                        emissive: new THREE.Color(0xffe680),
                        emissiveIntensity: 0.1
                    })
                );
                cap.position.y = 0.25;
                cap.rotation.x = Math.PI;

                mushroom.add(stem);
                mushroom.add(cap);
                mushroom.position.set(0.3, -0.5, 0.3);
                scene.add(mushroom);

                // 加載備用模型
                setModel(scene);
                return;
            }

            const currentPath = possiblePaths[pathIndex];
            console.log(`嘗試加載模型 (嘗試 ${pathIndex + 1}/${possiblePaths.length}): ${currentPath}`);

            loader.load(
                currentPath,
                (gltf) => {
                    console.log('模型加載成功!', gltf);

                    // 調整模型以適應場景
                    gltf.scene.scale.set(1, 1, 1); // 調整模型大小 - 放大100倍
                    gltf.scene.position.set(0, -1, 0); // 調整模型位置
                    gltf.scene.rotation.y = Math.PI / 4; // 稍微旋轉以獲得更好的視角

                    // 記錄可點擊的模型部分
                    const clickable = {};

                    // 為模型的不同部分應用材質
                    gltf.scene.traverse((child) => {
                        if (child.isMesh) {
                            // 啟用陰影
                            child.castShadow = true;
                            child.receiveShadow = true;

                            // 根據網格名稱，我們應用對應的紋理
                            const nameLower = child.name.toLowerCase();
                            console.log('找到網格:', child.name);

                            // 根據模型中的實際網格名稱進行處理
                            if (nameLower.includes('ground')) {
                                // 地面材質
                                if (!child.material.map && textures.groundBaseColor) {
                                    child.material.map = textures.groundBaseColor;
                                }
                                child.material.roughness = 1.0;
                                child.material.metalness = 0.0;
                                child.material.emissive = new THREE.Color(0xf5e8b5);
                                child.material.emissiveIntensity = 0.05;
                                clickable[child.uuid] = 'ground';
                            } else if (nameLower.includes('mushroom') || nameLower.includes('rock')) {
                                // 蘑菇和岩石使用同一個材質
                                if (!child.material.map && textures.mushroomsBaseColor) {
                                    child.material.map = textures.mushroomsBaseColor;
                                }
                                if (!child.material.normalMap && textures.mushroomsNormal) {
                                    child.material.normalMap = textures.mushroomsNormal;
                                }
                                child.material.roughness = 0.9;
                                child.material.metalness = 0.1;
                                child.material.emissive = new THREE.Color(0xf7e8c2);
                                child.material.emissiveIntensity = 0.15;
                                clickable[child.uuid] = 'mushroom';
                            } else if (nameLower.includes('material.001')) {
                                // Material.001 (可能是植物/花朵)
                                if (!child.material.map && textures.material001BaseColor) {
                                    child.material.map = textures.material001BaseColor;
                                }
                                if (!child.material.normalMap && textures.material001Normal) {
                                    child.material.normalMap = textures.material001Normal;
                                }
                                child.material.roughness = 0.7;
                                child.material.metalness = 0.0;
                                child.material.emissive = new THREE.Color(0xfff5cc);
                                child.material.emissiveIntensity = 0.1;
                                clickable[child.uuid] = 'flower';
                            } else {
                                // 其他部分使用一般材質 (可能是主要的木頭材質)
                                if (!child.material.map && textures.materialBaseColor) {
                                    child.material.map = textures.materialBaseColor;
                                }
                                if (!child.material.normalMap && textures.materialNormal) {
                                    child.material.normalMap = textures.materialNormal;
                                }
                                child.material.roughness = 0.8;
                                child.material.metalness = 0.2;
                                child.material.emissive = new THREE.Color(0xffe680);
                                child.material.emissiveIntensity = 0.1;
                                clickable[child.uuid] = 'log';
                            }

                            // 確保材質正確設置
                            child.material.needsUpdate = true;
                        }
                    });

                    // 設置模型
                    if (isMounted) {
                        setModel(gltf.scene);
                    }
                },
                onProgress,
                (error) => {
                    console.warn(`嘗試路徑 ${currentPath} 失敗:`, error);
                    // 嘗試下一個路徑
                    if (isMounted) {
                        attemptLoadModel(pathIndex + 1);
                    }
                }
            );
        };

        // 只在組件首次渲染時加載模型
        console.log('開始加載模型 - 只執行一次');
        attemptLoadModel(0);

        // 清理函數
        return () => {
            console.log('清理模型加載');
            isMounted = false; // 標記組件已卸載
        };
    }, [model,
        // 添加所有需要的依賴，但是使用空函數來避免無限循環
        // eslint-disable-next-line react-hooks/exhaustive-deps
        () => textures.groundBaseColor,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        () => textures.material001BaseColor,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        () => textures.material001Normal,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        () => textures.materialBaseColor,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        () => textures.materialNormal,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        () => textures.mushroomsBaseColor,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        () => textures.mushroomsNormal
    ]); // 添加 model 依賴項

    return (
        <group ref={groupRef}>
            {model && <primitive object={model} onClick={handleModelClick} />}
        </group>
    );
}

// 主場景組件
function MossyLogScene({ isPreloading = false }) {
    const mountRef = useRef(null);
    const [sceneReady, setSceneReady] = useState(false);

    // 在組件加載後標記場景準備就緒
    useEffect(() => {
        // 如果上次渲染有創建場景，先清理
        if (mountRef.current && mountRef.current.__sceneInitialized) {
            // 執行清理代碼...
            return;
        }

        // 在這裡初始化Three.js並加載資源
        // ...現有加載代碼...

        // 標記資源已加載
        if (!isPreloading) {
            setSceneReady(true);

            // 在非預加載模式時進行實際的渲染和動畫循環
            // ...現有初始化和渲染代碼...
        }

        // 標記已初始化
        if (mountRef.current) {
            mountRef.current.__sceneInitialized = true;
        }

        // 清理函數
        return () => {
            // 不在預加載模式時才執行清理
            if (!isPreloading) {
                // ...現有清理代碼...
            }
        };
    }, [isPreloading]); // 依賴於isPreloading，以便在狀態變化時重新運行

    // 渲染3D場景的容器
    return (
        <div
            ref={mountRef}
            className={`w-full h-full ${isPreloading ? 'hidden' : ''}`}
            style={{ position: 'absolute', top: 0, left: 0 }}
        >
            <Loader />
            <Canvas
                camera={{ position: [3, 2, 5], fov: 45 }}
                shadows
                className="w-full h-full"
                gl={{ antialias: true }}
                dpr={[1, 2]} // 提高渲染品質
                onCreated={({ gl }) => {
                    // 設置一些渲染器選項
                    gl.setClearColor('#111100');
                    // 啟用 Three.js 的內建錯誤處理
                    gl.getContext().getExtension('WEBGL_debug_renderer_info');
                    console.log('Canvas 已創建完成');
                }}
            >
                {/* 黑色背景 */}
                <color attach="background" args={["#111100"]} />

                {/* 增強霧氣效果 - 縮短可視距離並增加密度 */}
                <fog attach="fog" args={["#1a1a0a", 3, 2]} />

                {/* 光源設置 - 減少光源以體現暗處發光效果 */}
                <ambientLight intensity={0.2} color="#ffe0a0" /> {/* 降低環境光，使發光效果更明顯 */}
                <directionalLight
                    position={[10, 10, 5]}
                    intensity={0.3}
                    color="#fff6d0"
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                />

                {/* 添加樹幹周圍的點光源 */}
                <pointLight position={[0, 0, 0]} intensity={0.01} color="#fff0a0" distance={5} decay={2} />

                {/* 地面 */}
                <mesh
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[0, -1.01, 0]}
                    receiveShadow
                    onClick={() => {
                        if (window.audioManager) {
                            window.audioManager.playSound('floor-tap');
                        }
                    }}
                >
                    <planeGeometry args={[20, 20]} />
                    <shadowMaterial opacity={0.2} />
                </mesh>

                <Suspense fallback={null}>
                    <MossyLogModel />

                    {/* 只有在場景準備就緒後才渲染粒子系統 */}
                    {sceneReady && (
                        <React.Fragment>
                            {/* 提升螢火蟲數量並同時運行，將 count 與 maxCount 由1000調整為2000 */}
                            <GlowingParticles count={2000} maxCount={2000} color="#ffed97" size={0.015} />
                        </React.Fragment>
                    )}

                    <Environment preset="sunset" /> {/* 更改環境預設為日落，營造更溫暖的黃色氛圍 */}
                </Suspense>

                {/* 更新後處理效果配置 - 使用最簡單的配置以提高兼容性 */}
                <EffectComposer>
                    <Bloom
                        intensity={1.2}
                        luminanceThreshold={0.6}
                        luminanceSmoothing={0.3}
                        radius={0.85}
                    />
                </EffectComposer>

                {/* 添加OrbitControls，不再有條件渲染 */}
                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={4.5}
                    maxDistance={6}
                    minPolarAngle={0}
                    maxPolarAngle={Math.PI / 2}
                />
            </Canvas>
        </div>
    );
}

export default MossyLogScene; 