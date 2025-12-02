import React, { memo } from 'react';
import { Star } from 'lucide-react';
import { useAppState } from '../context/AppStateContext';

const HUD = memo(() => {
    const { coins, streak, screen } = useAppState();

    return (
        <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 z-30 flex justify-between items-center pointer-events-none">
            <div className="flex items-center gap-2">
                {/* Stars */}
                <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full border border-white/10 shadow-lg">
                    <Star className="hud-star fill-yellow-400 text-yellow-400 w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-white font-bold text-xs">{coins}</span>
                </div>
                {/* Streak */}
                {streak > 0 && (
                    <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500/30 to-red-500/30 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full border border-orange-400/30 shadow-lg">
                        <span className="text-sm">🔥</span>
                        <span className="text-white font-bold text-xs">{streak}</span>
                    </div>
                )}
            </div>
            <div className="bg-black/20 backdrop-blur-md px-3 sm:px-4 py-1 rounded-full border border-white/10">
                <span className="text-white font-[nunito] font-black text-xs sm:text-sm tracking-widest uppercase">
                    {screen === 'checkin' ? 'Hoje' : screen === 'map' ? 'Caminho' : 'Lar'}
                </span>
            </div>
            <div className="w-8 sm:w-12"></div>
        </div>
    );
});

HUD.displayName = 'HUD';

export default HUD;
