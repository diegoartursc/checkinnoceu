import React, { memo, useRef, useLayoutEffect, useCallback, useMemo } from 'react';
import { Star, Cloud, Play, CheckCircle } from 'lucide-react';
import DayNode from './DayNode';
import DynamicRoadPath from './DynamicRoadPath';
import FloatingAvatar from './FloatingAvatar';
import { MONTHS_CONFIG } from '../../config/gameConfig';
import { calculatePathPosition, calculateDayIndexInYear } from '../../utils/mapUtils';

const MapScreen = memo(({ lastCompletedDay, onDayClick, completedDays = {} }) => {
  const containerRef = useRef(null);
  const currentDayRef = useRef(null);

  const reversedMonths = useMemo(() => [...MONTHS_CONFIG].reverse(), []);

  // Optimized: Scroll animation only runs once on mount
  useLayoutEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;

      // Initial scroll to bottom
      container.scrollTo({ top: container.scrollHeight, behavior: 'auto' });

      // Scroll to current day
      const scrollBackTimer = setTimeout(() => {
        if (currentDayRef.current) {
            currentDayRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);

      return () => {
        clearTimeout(scrollBackTimer);
      };
    }
  }, []);

  return (
    <div
        ref={containerRef}
        className="h-full overflow-y-auto pb-24 relative scroll-smooth optimize-scroll custom-scrollbar bg-gradient-to-t from-sky-200 via-indigo-300 to-indigo-950"
    >
        {/* Simple Header */}
        <div className="pt-20 sm:pt-32 pb-10 text-center z-10 relative">
            <h2 className="text-white font-black text-xl sm:text-2xl mt-4 drop-shadow-md tracking-widest uppercase">
              Caminho da Vida
            </h2>
        </div>

      <div className="flex flex-col items-center px-2">
        {reversedMonths.map((month, reverseIndex) => {
          // Calculate real month index (0-11) for date comparison
          const monthIndex = 11 - reverseIndex; // Dezembro=11, Janeiro=0

          return (
            <div key={month.name} className="w-full mb-8 relative flex flex-col items-center">

              <div className="flex justify-center mb-4 relative z-10">
                <div className="bg-white/10 backdrop-blur px-3 sm:px-4 py-1 rounded-full border border-white/20">
                  <span className="text-white font-bold text-[10px] uppercase tracking-widest">
                    Fim de {month.name}
                  </span>
                </div>
              </div>

              {/* Sinuous Path Container */}
              <div className="relative w-full" style={{ height: `${month.days * 55 + 100}px` }}>

                {/* Dynamic Road Path */}
                {(() => {
                  // Collect node coordinates
                  const nodePositions = Array.from({ length: month.days }, (_, i) => {
                    const dayIndex = i;
                    const pathPosition = calculatePathPosition(dayIndex, month.days);

                    // Convert percentage to absolute pixels
                    const containerWidth = typeof window !== 'undefined' ? window.innerWidth : 400;
                    const x = (parseFloat(pathPosition.left) / 100) * containerWidth;
                    const y = parseInt(pathPosition.top);

                    return { x, y };
                  });

                  return <DynamicRoadPath nodePositions={nodePositions} containerHeight={month.days * 55 + 100} />;
                })()}

                {/* Sinuous path of days */}
                {Array.from({ length: month.days }, (_, i) => {
                  const dayNum = month.days - i; // Countdown from month.days to 1
                  const dayIndex = i; // Index for path calculation
                  const pathPosition = calculatePathPosition(dayIndex, month.days);

                  // NOTE: Special dates and decorations removed as requested.
                  const dayIndexInYear = calculateDayIndexInYear(monthIndex, dayNum, MONTHS_CONFIG);
                  const isCurrentDay = dayIndexInYear === lastCompletedDay + 1;

                  return (
                    <div key={dayNum} ref={isCurrentDay ? currentDayRef : null}>
                      <DayNode
                        dayNum={dayNum}
                        month={month}
                        monthIndex={monthIndex}
                        dayIndexInYear={dayIndexInYear}
                        isCurrentDay={isCurrentDay}
                        // specialDate={specialDate} // Removed
                        // onSpecialClick={handleSpecialDateClick} // Removed
                        lastCompletedDay={lastCompletedDay}
                        onDayClick={onDayClick}
                        completedDays={completedDays}
                        style={pathPosition}
                      />

                      {isCurrentDay && (
                        <div
                          className="absolute z-50"
                          style={{
                            left: pathPosition.left,
                            top: `${parseInt(pathPosition.top) - 60}px`,
                            transform: 'translateX(-50%)'
                          }}
                        >
                          <FloatingAvatar />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4">
                <span className="text-white/40 font-black text-3xl sm:text-4xl uppercase tracking-tighter opacity-20 select-none">
                  {month.name.substring(0, 3)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pb-32 pt-10 text-center relative z-10">
        <p className="text-white/60 font-bold uppercase tracking-widest text-xs">Início</p>
      </div>
    </div>
  );
});

MapScreen.displayName = 'MapScreen';

export default MapScreen;
