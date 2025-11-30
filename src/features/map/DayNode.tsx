// src/features/map/DayNode.tsx
import React, { memo, useMemo } from 'react';
import { Sun } from 'lucide-react';

interface DayNodeProps {
    dayNum: number;
    isCurrentDay: boolean;
    specialDate: any;
    onSpecialClick: (date: any) => void;
    monthIndex: number;
    style: any;
}

const DayNode = memo(({ dayNum, isCurrentDay, specialDate, onSpecialClick, monthIndex, style }: DayNodeProps) => {
  // Calculate if this day is in the past
  const isPast = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth(); // 0-11
    const currentDay = today.getDate();

    // monthIndex: 0=Janeiro, 1=Fevereiro, ..., 11=Dezembro
    if (monthIndex < currentMonth) return true; // Mês já passou
    if (monthIndex > currentMonth) return false; // Mês futuro
    return dayNum < currentDay; // Mesmo mês: compara dia
  }, [dayNum, monthIndex]);

  const neonStyle = specialDate ? `${specialDate.color}` : '';
  const SpecialIcon = specialDate?.icon;

  return (
    <div className="absolute flex justify-center z-10" style={style}>
      <div
        onClick={() => specialDate && !isPast && onSpecialClick(specialDate)}
        className={`
            w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500 border-[3px]
            ${isCurrentDay
                ? 'bg-gradient-to-b from-yellow-300 to-yellow-500 border-yellow-600 scale-125 sm:scale-150 shadow-[0_0_25px_rgba(250,204,21,0.8)] z-20 animate-pulse'
                : isPast
                    ? 'bg-gradient-to-b from-slate-700/60 to-slate-800/60 border-slate-600 text-slate-500 opacity-40 scale-90 grayscale'
                    : specialDate
                        ? `${neonStyle} cursor-pointer hover:scale-125 shadow-lg border-white/50`
                        : 'bg-gradient-to-b from-blue-400 to-blue-600 border-blue-700 text-white shadow-[0_4px_15px_rgba(59,130,246,0.5)] hover:scale-110 hover:shadow-[0_6px_20px_rgba(59,130,246,0.6)]'
            }
        `}
      >
        {isCurrentDay ? (
          <Sun size={18} className="text-yellow-900 animate-spin-slow sm:w-6 sm:h-6" strokeWidth={2.5} />
        ) : (
          specialDate ? <SpecialIcon size={10} className={!isPast && "animate-spin-slow"}/> : dayNum
        )}
      </div>
    </div>
  );
});

DayNode.displayName = 'DayNode';

export default DayNode;
