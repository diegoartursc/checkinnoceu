// src/features/game/RevealGame.tsx
import React, { memo, useState, useCallback, useRef } from 'react';
import { Cloud } from 'lucide-react';

interface RevealGameProps {
    data: {
        icon: React.ReactNode;
    };
    onWin: () => void;
}

const RevealGame = memo(({ data, onWin }: RevealGameProps) => {
    const [tiles, setTiles] = useState(Array(16).fill(true));
    const hasWonRef = useRef(false);

    const handleHover = useCallback((index: number) => {
        setTiles(prev => {
            const n = [...prev];
            n[index] = false;
            const cleared = n.filter(x => !x).length;
            if (cleared >= 14 && !hasWonRef.current) {
                hasWonRef.current = true;
                onWin();
            }
            return n;
        });
    }, [onWin]);

    return (
        <div className="h-full flex flex-col items-center justify-center bg-yellow-50 rounded-xl p-4">
            <h4 className="font-bold text-yellow-800 mb-2 text-sm sm:text-base">Limpe o céu!</h4>
            <div className="w-48 h-48 sm:w-64 sm:h-64 relative bg-sky-300 rounded-xl overflow-hidden flex items-center justify-center shadow-inner border-4 border-yellow-300">
                <div className="text-6xl sm:text-8xl animate-spin-slow">{data.icon}</div>
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
                    {tiles.map((covered, i) => (
                        <div
                            key={i}
                            onMouseEnter={() => handleHover(i)}
                            onTouchMove={() => handleHover(i)}
                            onClick={() => handleHover(i)}
                            className={`transition-opacity duration-500 bg-gray-200 border border-gray-300 flex items-center justify-center ${
                                covered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            }`}
                        >
                            <Cloud size={20} className="text-gray-400" />
                        </div>
                    ))}
                </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Passe o dedo para limpar</p>
        </div>
    );
});

RevealGame.displayName = 'RevealGame';

export default RevealGame;
