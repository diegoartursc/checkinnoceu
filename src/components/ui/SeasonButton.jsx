import React, { memo, useMemo } from 'react';
import { Leaf, Snowflake, Flower, Sun } from 'lucide-react';

const SeasonButton = memo(({ season, onClick }) => {
    const { buttonStyle, decor } = useMemo(() => {
        let buttonStyle = "";
        let decor = null;

        if (season.id.includes("autumn")) {
            buttonStyle = "bg-gradient-to-br from-orange-400 to-red-600 border-orange-200 text-white shadow-orange-500/50";
            decor = <><Leaf size={20} className="absolute -top-3 -right-2 text-yellow-300 rotate-12 drop-shadow-sm animate-bounce" /><Leaf size={16} className="absolute -bottom-2 -left-2 text-orange-200 -rotate-45 drop-shadow-sm" /></>;
        } else if (season.id.includes("winter")) {
            buttonStyle = "bg-gradient-to-br from-sky-400 to-blue-700 border-sky-200 text-white shadow-sky-500/50";
            decor = <><Snowflake size={20} className="absolute -top-3 -left-2 text-white animate-spin-slow" /><div className="absolute inset-0 bg-white/10 rounded-2xl animate-pulse"></div></>;
        } else if (season.id.includes("spring")) {
            buttonStyle = "bg-gradient-to-br from-pink-400 to-rose-600 border-pink-200 text-white shadow-pink-500/50";
            decor = <><Flower size={20} className="absolute -top-4 -right-1 text-yellow-200 animate-bounce" /><Leaf size={14} className="absolute -bottom-1 left-2 text-green-300 rotate-45" /></>;
        } else if (season.id.includes("summer")) {
            buttonStyle = "bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-100 text-orange-900 shadow-yellow-500/50";
            decor = <><Sun size={24} className="absolute -top-4 -left-2 text-yellow-100 animate-spin-slow" /></>;
        }

        return { buttonStyle, decor };
    }, [season.id]);

    const Icon = season.icon;

    return (
        <div className="relative group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/20 rounded-full blur-xl -z-10 group-hover:bg-white/40 transition-all"></div>
            <button onClick={onClick} className={`relative w-40 sm:w-48 py-3 sm:py-4 rounded-3xl shadow-2xl border-4 border-b-6 flex items-center justify-center gap-2 sm:gap-3 transition-all transform active:border-b-0 active:translate-y-2 hover:scale-105 hover:-translate-y-1 ${buttonStyle}`}>
                <Icon size={24} className="drop-shadow-md" />
                <span className="text-xs font-black uppercase tracking-widest drop-shadow-sm">{season.name}</span>
                {decor}
            </button>
        </div>
    );
});

SeasonButton.displayName = 'SeasonButton';

export default SeasonButton;
