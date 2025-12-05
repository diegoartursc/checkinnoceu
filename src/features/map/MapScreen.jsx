import React, { memo, useRef, useLayoutEffect, useMemo } from 'react';
import { Cloud, Star, Lock, Check, MapPin } from 'lucide-react';
import { MONTHS_CONFIG } from '../../config/gameConfig';
import { calculateDayIndexInYear } from '../../utils/mapUtils';

// Helper component for each Cloud Step
const CloudStep = memo(({
  dayNum,
  globalDayIndex,
  status, // 'locked', 'current', 'completed'
  onClick,
  isLeft
}) => {
  return (
    <div
      className={`relative flex items-center justify-center w-full mb-8 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
      onClick={() => onClick(globalDayIndex)}
    >
      {/* Cloud Icon Container */}
      <div className={`
        relative w-28 h-20 flex items-center justify-center transition-transform duration-300
        ${status === 'current' ? 'scale-125 z-20' : 'scale-100 z-10 hover:scale-105 active:scale-95'}
        ${status === 'locked' ? 'opacity-60 grayscale' : 'opacity-100'}
      `}>
        {/* The Cloud Icon */}
        <Cloud
          fill={status === 'completed' ? '#dbeafe' : status === 'current' ? '#ffffff' : '#94a3b8'}
          className={`
            w-full h-full drop-shadow-xl
            ${status === 'completed' ? 'text-blue-100' : status === 'current' ? 'text-white' : 'text-slate-300'}
          `}
          strokeWidth={1.5}
        />

        {/* Content inside Cloud */}
        <div className="absolute inset-0 flex items-center justify-center pt-2">
          {status === 'completed' ? (
            <Check size={32} className="text-blue-600 font-bold" strokeWidth={4} />
          ) : status === 'locked' ? (
            <span className="text-xl font-bold text-slate-500">{dayNum}</span>
          ) : (
            <span className="text-3xl font-black text-blue-600 animate-pulse">{dayNum}</span>
          )}
        </div>

        {/* Current Day Indicators */}
        {status === 'current' && (
          <>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 animate-bounce">
              <MapPin className="text-yellow-400 fill-yellow-400 drop-shadow-lg" size={32} />
            </div>
            <div className="absolute inset-0 bg-white/30 blur-xl rounded-full -z-10 animate-pulse" />
          </>
        )}
      </div>

      {/* Connection Line (CSS pseudo-element simulation or simple div) */}
      {/* We can do a dashed line to the next/prev element, but purely vertical is safer for now */}
    </div>
  );
});

const MapScreen = memo(({ lastCompletedDay, onOpenGame, onDayClick, completedDays = {} }) => {
  const containerRef = useRef(null);
  const currentDayRef = useRef(null);

  // Flatten months into a reversed list of days (to start from bottom visually if we scroll)
  // But usually, user starts at Day 1 (Bottom) and goes up.
  // We will render reversedMonths (Dec -> Jan) so Jan is at bottom.
  const reversedMonths = useMemo(() => [...MONTHS_CONFIG].reverse(), []);

  // Scroll to current day logic
  useLayoutEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;

      // Initial scroll to bottom (January)
      // container.scrollTo({ top: container.scrollHeight, behavior: 'instant' });

      // Then smooth scroll to current day
      setTimeout(() => {
        if (currentDayRef.current) {
            currentDayRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
             // If no current day ref (e.g. day 1), scroll to bottom
             container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        }
      }, 500);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-y-auto overflow-x-hidden bg-gradient-to-b from-sky-300 via-sky-400 to-blue-500 pb-24"
    >
      {/* --- Background Elements --- */}

      {/* Sun / Light Source */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-yellow-200/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Mascot (Fixed absolute in container) */}
      <div className="fixed top-20 left-4 z-50 animate-bounce-slow pointer-events-none">
         <Cloud size={64} className="text-white fill-white drop-shadow-lg" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2">
            <div className="w-2 h-2 bg-slate-800 rounded-full" />
            <div className="w-2 h-2 bg-slate-800 rounded-full" />
         </div>
         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4 h-2 border-b-2 border-slate-800 rounded-full" />
      </div>

      {/* Header Space */}
      <div className="pt-32 pb-10 text-center relative z-10">
        <h1 className="text-3xl font-black text-white drop-shadow-md tracking-wider uppercase">
          Minha Jornada
        </h1>
        <p className="text-white/80 font-bold text-sm">Rumo ao Céu!</p>
      </div>

      {/* --- Path Content --- */}
      <div className="flex flex-col items-center px-4 space-y-4">
        {reversedMonths.map((month, reverseIndex) => {
           const monthIndex = 11 - reverseIndex;

           // Render Month Title
           return (
             <div key={month.name} className="w-full flex flex-col items-center">
               <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-8 border border-white/30 shadow-sm">
                 <span className="text-white font-extrabold uppercase tracking-widest text-sm">
                   {month.name}
                 </span>
               </div>

               {/* Days Loop (Reversed: End of month to Start of month) */}
               {Array.from({ length: month.days }).map((_, i) => {
                 const dayNum = month.days - i;
                 const dayIndexInYear = calculateDayIndexInYear(monthIndex, dayNum, MONTHS_CONFIG);
                 const globalDayIndex = dayIndexInYear - 1; // 0-based index for logic

                 // Determine Status
                 let status = 'locked';
                 if (globalDayIndex < lastCompletedDay) {
                   status = 'completed';
                 } else if (globalDayIndex === lastCompletedDay) {
                   status = 'current';
                 }

                 return (
                   <div key={dayNum} ref={status === 'current' ? currentDayRef : null} className="w-full">
                      <CloudStep
                        dayNum={dayNum}
                        globalDayIndex={globalDayIndex}
                        status={status}
                        onClick={() => onDayClick(globalDayIndex, month)} // Pass month data if needed
                        isLeft={dayNum % 2 !== 0} // Zigzag pattern
                      />
                   </div>
                 );
               })}
             </div>
           );
        })}
      </div>

      {/* --- Footer Decoration --- */}
      <div className="relative w-full h-32 mt-10">
         {/* Hills */}
         <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-[50%] scale-150 translate-y-8" />
         <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-emerald-600 to-emerald-500 rounded-t-[60%] scale-125 translate-y-10 opacity-80" />
      </div>

    </div>
  );
});

MapScreen.displayName = 'MapScreen';

export default MapScreen;
