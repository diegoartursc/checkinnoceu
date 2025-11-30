// src/features/game/WarmupGame.tsx
import React, { memo, useState, useEffect, useRef } from 'react';

interface WarmupGameProps {
    data: {
        icon: React.ReactNode;
    };
    onWin: () => void;
}

const WarmupGame = memo(({ data, onWin }: WarmupGameProps) => {
    const [temp, setTemp] = useState(50);
    const [timeLeft, setTimeLeft] = useState(10);
    const hasWonRef = useRef(false);

    useEffect(() => {
        const timer = setInterval(() => {
            if (hasWonRef.current) return;
            setTimeLeft(t => {
                if (t <= 1 && temp > 0) {
                    hasWonRef.current = true;
                    onWin();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        const cooler = setInterval(() => {
            if (hasWonRef.current) return;
            setTemp(t => Math.max(0, t - 2));
        }, 100);

        return () => {
            clearInterval(timer);
            clearInterval(cooler);
        };
    }, [temp, onWin]);

    return (
        <div className="h-full flex flex-col items-center justify-center bg-blue-50 rounded-xl p-4">
            <div className="w-full h-48 sm:h-64 bg-slate-800 rounded-2xl relative overflow-hidden flex flex-col items-center justify-end pb-4 border-4 border-slate-600">
                <div className="text-4xl sm:text-6xl transition-all duration-100" style={{ transform: `scale(${temp/50})`, opacity: temp/100 }}>
                    {data.icon}
                </div>
                <div className="absolute right-2 top-2 bottom-2 w-4 bg-gray-700 rounded-full overflow-hidden border border-gray-500">
                    <div className={`absolute bottom-0 w-full transition-all duration-200 ${temp > 50 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ height: `${temp}%` }} />
                </div>
                {temp < 30 && <div className="absolute top-2 text-2xl animate-bounce">❄️</div>}
            </div>
            <div className="w-full mt-4 flex items-center gap-2 sm:gap-4">
                <div className="font-bold text-gray-500 w-12 sm:w-16 text-sm sm:text-base">{timeLeft}s</div>
                <button
                    onClick={() => setTemp(t => Math.min(100, t + 10))}
                    className="flex-1 bg-red-500 text-white font-black py-3 sm:py-4 rounded-xl shadow-lg active:scale-95 active:bg-red-600 text-xs sm:text-base"
                >
                    TAP! TAP! AQUECER!
                </button>
            </div>
        </div>
    );
});

WarmupGame.displayName = 'WarmupGame';

export default WarmupGame;
