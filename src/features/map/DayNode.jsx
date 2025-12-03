import React, { memo } from 'react';
import { Lock, Sun, CheckCircle, Crown } from 'lucide-react';

const DayNode = memo(({
  dayNum,
  month,
  status = 'locked', // 'locked' | 'current' | 'completed'
  specialDate,
  onSpecialClick,
  style,
  dayIndexInYear,
  onDayClick,
  completedDays = []
}) => {
  // Check if day has all 3 stars
  const stars = completedDays[dayIndexInYear] || 0;

  const neonStyle = specialDate ? `${specialDate.color}` : '';
  const SpecialIcon = specialDate?.icon;

  const handleClick = () => {
    if (status === 'locked') {
      // Gentle message for future days
      // We'll let the parent handle the toast or handle it here via a callback?
      // Since `onDayClick` is generic, we can pass a 'locked' flag or let parent decide.
      // But parent doesn't know click unless we call it.
      onDayClick(dayIndexInYear, month, 'locked');
      return;
    }

    if (specialDate && status !== 'completed') {
       onSpecialClick(specialDate);
    } else {
       onDayClick(dayIndexInYear, month, status);
    }
  };

  return (
    <div className="absolute flex flex-col items-center z-10" style={style}>
      {/* Sombra Projetada Realista */}
      <div className="absolute top-[32px] sm:top-[42px] w-12 h-3 bg-black/40 rounded-full blur-[3px] opacity-60"></div>

      {/* Crown for Completed/Current(Just Done) */}
      {(status === 'completed') && (
        <div className="absolute -top-5 z-30 animate-bounce-slow drop-shadow-lg">
           <Crown size={20} className="text-yellow-400 fill-yellow-200" strokeWidth={2.5} />
        </div>
      )}

      {/* Halo for Current (Active/Waiting) */}
      {status === 'current' && (
        <div className="absolute inset-0 -m-4 rounded-full border-4 border-yellow-300/50 animate-ping opacity-75"></div>
      )}

      {/* Botão do Dia */}
      <div
        onClick={handleClick}
        className={`
            relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black transition-all duration-500 border-[3px]
            ${status === 'current'
                ? 'bg-gradient-to-b from-yellow-300 to-yellow-500 border-yellow-600 scale-110 sm:scale-125 shadow-[0_0_30px_rgba(250,204,21,0.9)] z-20 animate-pulse cursor-pointer'
                : status === 'completed'
                    ? 'bg-gradient-to-b from-green-400 to-green-600 border-green-700 text-white shadow-[0_4px_15px_rgba(34,197,94,0.5)] cursor-pointer hover:scale-110'
                    : specialDate
                        ? `${neonStyle} cursor-pointer hover:scale-110 shadow-lg border-white/50 opacity-80`
                        : 'bg-gradient-to-b from-slate-700/80 to-slate-800/80 border-slate-600 text-slate-500 opacity-60 scale-95 cursor-not-allowed'
            }
        `}
      >
        {status === 'locked' ? (
           specialDate ? <SpecialIcon size={12} className="opacity-50" /> : <Lock size={12} className="text-slate-400" strokeWidth={2.5} />
        ) : status === 'current' ? (
           <Sun size={20} className="text-yellow-900 animate-spin-slow sm:w-6 sm:h-6" strokeWidth={2.5} />
        ) : status === 'completed' ? (
           <CheckCircle size={16} className="text-white" strokeWidth={3} />
        ) : (
           specialDate ? <SpecialIcon size={14} className="animate-spin-slow"/> : dayNum
        )}
      </div>

      {/* Day Number (if not locked/icon) */}
      {status !== 'locked' && !specialDate && status !== 'current' && status !== 'completed' && (
          <span className="absolute -bottom-5 text-[10px] font-bold text-white/80 drop-shadow-md">
            Dia {dayNum}
          </span>
      )}
    </div>
  );
});

DayNode.displayName = 'DayNode';

export default DayNode;
