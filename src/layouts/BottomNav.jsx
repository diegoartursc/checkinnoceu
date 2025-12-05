import React, { memo } from 'react';
import { Home, Map, Heart, Settings } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';

const BottomNav = memo(() => {
    const { screen, navigate } = useNavigation();

    return (
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.15)] flex items-center justify-around z-40 px-4 py-3 border-t-4 border-gray-100">
            <button
                onClick={() => navigate('checkin')}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${screen === 'checkin'
                        ? 'bg-gradient-to-b from-orange-400 to-orange-600 text-white shadow-[0_8px_25px_rgba(251,146,60,0.6)] scale-125 -translate-y-6 border-b-4 border-orange-700'
                        : 'text-slate-400 scale-100 hover:scale-110 active:scale-95'
                    }`}
            >
                <Home size={screen === 'checkin' ? 28 : 24} strokeWidth={3} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${screen === 'checkin' ? 'text-white' : 'text-slate-500'}`}>HOJE</span>
            </button>

            <button
                onClick={() => navigate('map')}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${screen === 'map'
                        ? 'bg-gradient-to-b from-blue-400 to-blue-600 text-white shadow-[0_8px_25px_rgba(59,130,246,0.6)] scale-125 -translate-y-6 border-b-4 border-blue-700'
                        : 'text-slate-400 scale-100 hover:scale-110 active:scale-95'
                    }`}
            >
                <Map size={screen === 'map' ? 28 : 24} strokeWidth={3} />
                <span className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${screen === 'map' ? 'text-white' : 'text-slate-500'}`}>CAMINHO</span>
            </button>

            <button
                onClick={() => navigate('lar')}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${screen === 'lar'
                        ? 'bg-gradient-to-b from-pink-400 to-pink-600 text-white shadow-[0_8px_25px_rgba(244,114,182,0.6)] scale-125 -translate-y-6 border-b-4 border-pink-700'
                        : 'text-slate-400 scale-100 hover:scale-110 active:scale-95'
                    }`}
            >
                <Heart size={screen === 'lar' ? 28 : 24} strokeWidth={3} fill={screen === 'lar' ? 'currentColor' : 'none'} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${screen === 'lar' ? 'text-white' : 'text-slate-500'}`}>LAR</span>
            </button>

            <button
                onClick={() => navigate('settings')}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${screen === 'settings'
                        ? 'bg-gradient-to-b from-slate-600 to-slate-800 text-white shadow-[0_8px_25px_rgba(71,85,105,0.6)] scale-125 -translate-y-6 border-b-4 border-slate-900'
                        : 'text-slate-400 scale-100 hover:scale-110 active:scale-95'
                    }`}
            >
                <Settings size={screen === 'settings' ? 28 : 24} strokeWidth={3} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${screen === 'settings' ? 'text-white' : 'text-slate-500'}`}>CONFIG</span>
            </button>
        </div>
    );
});

BottomNav.displayName = 'BottomNav';

export default BottomNav;
