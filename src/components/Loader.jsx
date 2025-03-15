import React from 'react';
import { useProgress } from '@react-three/drei';

// 顯示3D場景加載進度的組件
function Loader() {
    const { progress, active } = useProgress();

    return active ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
            <div className="w-64 p-6 text-center bg-black rounded-lg shadow-lg border border-amber-600">
                <div className="mb-3 text-lg font-semibold text-amber-400">正在載入神秘場景</div>
                <div className="w-full h-2 mb-3 bg-gray-800 rounded-full">
                    <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%`, boxShadow: '0 0 10px #ffb938, 0 0 5px #ffda85' }}
                    />
                </div>
                <div className="text-sm text-amber-300">{Math.round(progress)}%</div>
            </div>
        </div>
    ) : null;
}

export default Loader; 