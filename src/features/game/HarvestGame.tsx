// src/features/game/HarvestGame.tsx
import React, { memo, useState, useEffect, useCallback, useRef } from 'react';

interface HarvestGameProps {
    data: {
        target: string;
        bad: string;
    };
    onWin: () => void;
}

const HarvestGame = memo(({ data, onWin }: HarvestGameProps) => {
    const [grid, setGrid] = useState<(string | null)[]>(Array(9).fill(null));
    const [score, setScore] = useState(0);
    const hasWonRef = useRef(false);

    useEffect(() => {
        if (score >= 5 && !hasWonRef.current) {
            hasWonRef.current = true;
            onWin();
        }
    }, [score, onWin]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (score >= 5) return;
            const index = Math.floor(Math.random() * 9);
            const type = Math.random() > 0.3 ? 'target' : 'bad';
            setGrid(prev => {
                const newGrid = [...prev];
                newGrid[index] = type;
                return newGrid;
            });
            setTimeout(() => {
                setGrid(prev => {
                    const newGrid = [...prev];
                    if (newGrid[index] === type) newGrid[index] = null;
                    return newGrid;
                });
            }, 1000);
        }, 800);
        return () => clearInterval(interval);
    }, [score]);

    const handleTap = useCallback((index: number) => {
        if (grid[index] === 'target') {
            setScore(s => s + 1);
            setGrid(prev => {
                const n = [...prev];
                n[index] = 'pop';
                return n;
            });
        } else if (grid[index] === 'bad') {
            setScore(s => Math.max(0, s - 1));
        }
    }, [grid]);

    return (
        <div className="h-full flex flex-col items-center justify-center bg-orange-50 rounded-xl p-2">
            <h4 className="mb-2 font-bold text-orange-800 text-sm sm:text-base">Colha 5 {data.target}!</h4>
            <div className="grid grid-cols-3 gap-2 w-full max-w-[250px]">
                {grid.map((item, i) => (
                    <button
                        key={i}
                        onClick={() => handleTap(i)}
                        className="aspect-square bg-orange-200 rounded-full flex items-center justify-center text-2xl sm:text-3xl shadow-inner active:scale-95 transition-all"
                    >
                        {item === 'target' && <span className="animate-bounce">{data.target}</span>}
                        {item === 'bad' && <span>{data.bad}</span>}
                        {item === 'pop' && <span className="scale-150 opacity-50">✨</span>}
                    </button>
                ))}
            </div>
            <div className="mt-4 font-black text-xl sm:text-2xl text-orange-600">{score}/5</div>
        </div>
    );
});

HarvestGame.displayName = 'HarvestGame';

export default HarvestGame;
