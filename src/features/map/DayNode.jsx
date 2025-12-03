import React, { memo } from 'react';
import { Lock, Sun, CheckCircle } from 'lucide-react';

// Optimized: Memoize individual day component with bloqueio progression system
const DayNode = memo(({
  dayNum,
  month,
  isCurrentDay,
  specialDate,
  onSpecialClick,
  onLockedDayClick,
  style,
  dayIndexInYear,
  lastCompletedDay,
  onDayClick,
  completedDays = []
}) => {
  // Calculate if this day is locked (not completed previous day)
  const isLocked = dayIndexInYear > lastCompletedDay;
  const isCompleted = dayIndexInYear < lastCompletedDay;
  const isAvailable = dayIndexInYear === lastCompletedDay;

  // Check if day has all 3 stars
  const stars = completedDays[dayIndexInYear] || 0;

  const neonStyle = specialDate ? `${specialDate.color}` : '';
  const SpecialIcon = specialDate?.icon;

  const handleClick = () => {
    if (isLocked) {
        if (onLockedDayClick) onLockedDayClick();
        return;
    }
    if (specialDate && !isCompleted) {
      onSpecialClick(specialDate);
    } else if (isAvailable || isCurrentDay) {
      onDayClick(dayIndexInYear, month);
    }
  };

  return (
    <div className="absolute flex flex-col items-center z-10" style={style}>
      {/* Sombra Projetada Realista (projetada sobre a estrada) */}
      <div className="absolute top-[32px] sm:top-[42px] w-12 h-3 bg-black/40 rounded-full blur-[3px] opacity-60"></div>

      {/* Botão do Dia (Level Node) */}
      <div
        onClick={handleClick}
        className={`
            relative w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500 border-[3px]
            ${isAvailable || isCurrentDay
                ? 'bg-gradient-to-b from-yellow-300 to-yellow-500 border-yellow-600 scale-125 sm:scale-150 shadow-[0_0_25px_rgba(250,204,21,0.8)] z-20 animate-pulse cursor-pointer'
                : isCompleted
                    ? 'bg-gradient-to-b from-green-400 to-green-600 border-green-700 text-white shadow-[0_4px_15px_rgba(34,197,94,0.5)] cursor-pointer hover:scale-110'
                    : isLocked
                        ? 'bg-gradient-to-b from-slate-700/60 to-slate-800/60 border-slate-600 text-slate-500 opacity-40 scale-90 grayscale cursor-pointer'
                        : specialDate
                            ? `${neonStyle} cursor-pointer hover:scale-125 shadow-lg border-white/50`
                            : 'bg-gradient-to-b from-blue-400 to-blue-600 border-blue-700 text-white shadow-[0_4px_15px_rgba(59,130,246,0.5)] hover:scale-110 hover:shadow-[0_6px_20px_rgba(59,130,246,0.6)]'
            }
        `}
      >
        {isLocked ? (
          <Lock size={12} className="text-slate-400" strokeWidth={2.5} />
        ) : isAvailable || isCurrentDay ? (
          <Sun size={18} className="text-yellow-900 animate-spin-slow sm:w-6 sm:h-6" strokeWidth={2.5} />
        ) : isCompleted && stars >= 3 ? (
          <CheckCircle size={14} className="text-white" strokeWidth={2.5} />
        ) : (
          specialDate ? <SpecialIcon size={10} className="animate-spin-slow"/> : dayNum
        )}
      </div>

      {/* Stars indicator for completed days */}
      {isCompleted && stars > 0 && (
        <div className="absolute -bottom-3 flex gap-[2px]">
          {/*
          {Array.from({ length: 3 }).map((_, i) => (
            <Star
              key={i}
              size={8}
              className={i < stars ? 'text-yellow-400' : 'text-gray-300'}
              fill={i < stars ? 'currentColor' : 'none'}
              strokeWidth={2}
            />
          ))}
          */}
        </div>
      )}
    </div>
  );
});

DayNode.displayName = 'DayNode';

export default DayNode;
