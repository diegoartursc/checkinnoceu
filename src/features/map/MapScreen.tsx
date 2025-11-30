// src/features/map/MapScreen.tsx
import React, { memo, useRef, useState, useLayoutEffect, useCallback, useMemo } from 'react';
import { Cloud, Star, BookOpen, Lock, Play, Gamepad2, Trophy, Clock, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import SeasonButton from '@/components/ui/SeasonButton';
import { MONTHS_CONFIG } from '@/data/monthsConfig';
import DayNode from './DayNode';
import ParallaxDecorations from './ParallaxDecorations';
import FloatingAvatar from './FloatingAvatar';
import { useUserProgress } from '@/context/UserProgressContext';

// Calculate sinuous path position (Match-3 style)
const calculatePathPosition = (dayIndex: number) => {
  // Vertical spacing between days
  const verticalSpacing = 55;
  const top = dayIndex * verticalSpacing;

  // S-curve using sine wave
  // Frequency: completes wave every ~12 days
  const waveFrequency = (Math.PI * 2) / 12;
  const waveAmplitude = 25; // Amplitude in %
  const centerPosition = 50; // Center position in %

  // Create smooth S-curve
  const left = centerPosition + (Math.sin(dayIndex * waveFrequency) * waveAmplitude);

  return {
    left: `${left}%`,
    top: `${top}px`
  };
};

interface MapScreenProps {
    onOpenGame: (config: any) => void;
    onOpenStory: (story: any) => void;
}

const MapScreen = memo(({ onOpenGame, onOpenStory }: MapScreenProps) => {
  const { unlockedStories, readStories } = useUserProgress();
  const containerRef = useRef<HTMLDivElement>(null);
  const currentDayRef = useRef<HTMLDivElement>(null);
  const [activeDecoration, setActiveDecoration] = useState<string | null>(null);
  const [selectedSpecialDate, setSelectedSpecialDate] = useState<any | null>(null);

  // Use a stable random seed or pre-calculated random values for decorations positions
  // To keep it simple but "pure" enough for React, we can generate these once.
  // However, since we are mapping over MONTHS_CONFIG, we can just use the index for determinism if we wanted,
  // or use useState to hold the random decision.
  const [decorSideMap] = useState(() => {
     return MONTHS_CONFIG.reduce((acc, month) => {
         acc[month.name] = Math.random() > 0.5;
         return acc;
     }, {} as Record<string, boolean>);
  });

  const reversedMonths = useMemo(() => [...MONTHS_CONFIG].reverse(), []);

  // Optimized: Scroll animation only runs once on mount
  useLayoutEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;

      container.scrollTo({ top: container.scrollHeight, behavior: 'auto' });

      const scrollUpTimer = setTimeout(() => {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      }, 300);

      const scrollBackTimer = setTimeout(() => {
        if (currentDayRef.current) {
            currentDayRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 2500);

      return () => {
        clearTimeout(scrollUpTimer);
        clearTimeout(scrollBackTimer);
      };
    }
  }, []);

  const handleCloseDecoration = useCallback(() => {
    setActiveDecoration(null);
  }, []);

  const handleSpecialDateClick = useCallback((date: any) => {
    setSelectedSpecialDate(date);
  }, []);

  return (
    <div
        ref={containerRef}
        className="h-full overflow-y-auto pb-24 relative scroll-smooth optimize-scroll custom-scrollbar bg-gradient-to-t from-sky-200 via-indigo-300 to-indigo-950"
        onClick={handleCloseDecoration}
    >
        {/* Parallax Decorations */}
        <ParallaxDecorations position={0} />

        <div className="pt-20 sm:pt-32 pb-10 text-center animate-pulse z-10 relative">
            <div className="inline-block relative">
                <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-50 rounded-full"></div>
                <Star className="relative text-yellow-200 fill-white drop-shadow-lg w-16 h-16 sm:w-20 sm:h-20"/>
            </div>
            <h2 className="text-white font-black text-xl sm:text-2xl mt-4 drop-shadow-md tracking-widest uppercase">
              Caminho da Vida
            </h2>
        </div>

      {selectedSpecialDate && (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300"
            onClick={() => setSelectedSpecialDate(null)}
        >
            <div
                className="bg-gradient-to-b from-yellow-50 to-white rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(250,204,21,0.5)] border-4 border-yellow-400 max-w-xs w-full relative animate-in zoom-in duration-500"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Sparkles decoration */}
                <div className="absolute -top-2 -left-2 text-yellow-400 animate-pulse">
                  <Star size={24} fill="currentColor" />
                </div>
                <div className="absolute -top-2 -right-2 text-yellow-400 animate-pulse delay-150">
                  <Star size={20} fill="currentColor" />
                </div>
                <div className="absolute -bottom-2 -left-2 text-yellow-400 animate-pulse delay-300">
                  <Star size={16} fill="currentColor" />
                </div>
                <div className="absolute -bottom-2 -right-2 text-yellow-400 animate-pulse delay-500">
                  <Star size={18} fill="currentColor" />
                </div>

                {/* Icon with glow effect */}
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-30 rounded-full animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 p-5 rounded-full shadow-2xl inline-block animate-bounce">
                    <selectedSpecialDate.icon size={48} className="text-white drop-shadow-lg" strokeWidth={2.5} />
                  </div>
                </div>

                {/* Hype title with animation */}
                <div className="mb-3 animate-in slide-in-from-bottom-4 duration-700">
                  <div className="inline-block bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent">
                    <h3 className="text-2xl font-black uppercase tracking-tight animate-pulse">
                      🎉 Em Breve! 🎉
                    </h3>
                  </div>
                  <h4 className="text-xl font-black text-gray-800 mt-2">{selectedSpecialDate.label}</h4>
                </div>

                {/* Message with better styling */}
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl mb-6 border-2 border-yellow-200 shadow-inner animate-in fade-in duration-1000">
                  <p className="text-gray-700 font-bold leading-relaxed text-base">
                    "{selectedSpecialDate.message}"
                  </p>
                </div>

                {/* CTA Button with pulse effect */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-500 blur-md opacity-50 rounded-xl animate-pulse"></div>
                  <Button
                    onClick={() => setSelectedSpecialDate(null)}
                    color="bg-gradient-to-r from-sky-500 to-blue-600 w-full text-base shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                  >
                    <Clock size={20} className="animate-spin-slow"/>
                    Aguarde o dia da surpresa!
                  </Button>
                </div>
              </div>
        </div>
      )}

      <div className="flex flex-col items-center px-2">
        {reversedMonths.map((month, reverseIndex) => {
          // Calculate real month index (0-11) for date comparison
          const monthIndex = 11 - reverseIndex; // Dezembro=11, Janeiro=0
          const isDecorLeft = decorSideMap[month.name];
          const isStoryLeft = !isDecorLeft;
          const MonthIcon = month.icon;
          const isMonthStoryUnlocked = unlockedStories.includes(month.story.id);
          const isMonthStoryRead = readStories.includes(month.story.id);

          return (
            <div key={month.name} className="w-full mb-8 relative flex flex-col items-center">

              <div className="absolute top-10 left-[-20px] text-white/20 animate-pulse gpu-accelerate" style={{ animationDelay: '1s' }}>
                <Cloud size={40} fill="currentColor" className="sm:w-15 sm:h-15" />
              </div>
              <div className="absolute bottom-20 right-[-30px] text-white/10 animate-pulse gpu-accelerate" style={{ animationDelay: '3s' }}>
                <Cloud size={60} fill="currentColor" className="sm:w-22 sm:h-22" />
              </div>

              {month.seasonEvent && (() => {
                 const season = month.seasonEvent;
                 const isSeasonStoryUnlocked = unlockedStories.includes(season.story.id);
                 const isSeasonStoryRead = readStories.includes(season.story.id);

                 return (
                     <div className="relative z-30 w-full flex flex-col items-center justify-center mb-8 mt-4 animate-in zoom-in duration-500">
                        <div className="absolute h-full w-0.5 border-l-2 border-dashed border-white/20 -z-10"></div>

                        <SeasonButton
                            season={season}
                            onClick={(e) => {
                                e.stopPropagation();
                                if(isMonthStoryUnlocked) {
                                    setActiveDecoration(activeDecoration === season.id ? null : season.id);
                                } else {
                                    alert("Complete a jornada do mês primeiro!");
                                }
                            }}
                        />
                        {isSeasonStoryUnlocked && !isSeasonStoryRead && (
                             <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 text-[8px] font-black px-2 py-0.5 rounded-full shadow-sm animate-bounce whitespace-nowrap z-40">
                               HISTÓRIA DESBLOQUEADA!
                             </div>
                        )}

                        {!isMonthStoryUnlocked && (
                             <div className="absolute top-0 right-10 bg-gray-800/80 rounded-full p-2 z-40 shadow-lg">
                               <Lock size={16} className="text-white" />
                             </div>
                        )}

                         {activeDecoration === season.id && (
                            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-56 sm:w-64 bg-white p-4 rounded-2xl shadow-2xl z-50 border-4 border-yellow-200" onClick={(e) => e.stopPropagation()}>
                                <h4 className={`font-black uppercase text-sm ${season.color} mb-1 text-center`}>
                                  {season.name}
                                </h4>
                                <p className="text-gray-600 text-xs font-bold leading-tight mb-3 text-center">
                                  {season.desc}
                                </p>
                                {isSeasonStoryUnlocked ? (
                                    <button
                                      onClick={() => onOpenStory(season.story)}
                                      className="w-full py-2 bg-yellow-400 text-yellow-900 rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2"
                                    >
                                      <BookOpen size={14} /> LER HISTÓRIA
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => isMonthStoryUnlocked ? onOpenGame(season) : alert("Jogue a missão do mês primeiro!")}
                                        className={`w-full py-2 rounded-xl text-xs font-black text-white shadow-md flex items-center justify-center gap-2
                                            ${isMonthStoryUnlocked ? season.color.replace('text', 'bg').replace('600', '500').replace('400', '500') : 'bg-gray-400 cursor-not-allowed'}`}
                                    >
                                        {isMonthStoryUnlocked ? <><Play size={14} /> JOGAR ESPECIAL</> : <><Lock size={14} /> BLOQUEADO</>}
                                    </button>
                                )}
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-yellow-200"></div>
                            </div>
                         )}
                     </div>
                 );
              })()}

              <div className={`absolute top-1/2 transform -translate-y-1/2 ${isDecorLeft ? 'left-2' : 'right-2'} z-20 flex flex-col items-center gap-2`}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDecoration(activeDecoration === month.name ? null : month.name);
                    }}
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white/50 backdrop-blur-md transition-all duration-300 ${
                      month.name === activeDecoration ? 'bg-white scale-110 rotate-3' : 'bg-white/20 hover:scale-105'
                    }`}
                  >
                      <MonthIcon size={24} className={`${month.color} drop-shadow-sm sm:w-8 sm:h-8`} />
                      <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow-sm border-2 border-white">
                        {isMonthStoryUnlocked ? <CheckCircle size={10} /> : <Play size={10} fill="currentColor" />}
                      </div>
                  </button>

                  {month.extraGame && (
                      <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if(isMonthStoryUnlocked) {
                                setActiveDecoration(activeDecoration === month.extraGame.title ? null : month.extraGame.title);
                            }
                        }}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-md border-2 border-white/50 transition-all
                            ${isMonthStoryUnlocked ? month.extraGame.bg : 'bg-gray-200 grayscale cursor-not-allowed'}
                        `}
                      >
                          {isMonthStoryUnlocked ? (
                            <Gamepad2 size={16} className={month.extraGame.color + ' sm:w-4 sm:h-4'} />
                          ) : (
                            <Lock size={12} className="text-gray-400 sm:w-3 sm:h-3" />
                          )}
                      </button>
                  )}

                  {activeDecoration === month.name && (
                      <div className={`absolute top-0 ${isDecorLeft ? 'left-16 sm:left-20' : 'right-16 sm:right-20'} w-48 sm:w-56 bg-white p-3 sm:p-4 rounded-2xl shadow-2xl z-50 animate-in zoom-in slide-in-from-${isDecorLeft ? 'left' : 'right'}-5 border-2 border-gray-100`} onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`p-1.5 rounded-lg ${month.bg}`}>
                              <MonthIcon size={14} className={month.color + ' sm:w-4 sm:h-4'} />
                            </div>
                            <h4 className={`font-black uppercase text-xs sm:text-sm ${month.color}`}>
                              {month.label}
                            </h4>
                          </div>
                          <p className="text-gray-600 text-xs font-bold leading-tight mb-3">{month.desc}</p>
                          <button
                            onClick={() => onOpenGame(month)}
                            className={`w-full py-2 rounded-xl text-xs font-black text-white shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2 ${month.color.replace('text', 'bg')}`}
                          >
                            <Trophy size={14} /> {isMonthStoryUnlocked ? "JOGAR NOVAMENTE" : "JOGAR MISSÃO"}
                          </button>
                      </div>
                  )}

                  {month.extraGame && activeDecoration === month.extraGame.title && (
                      <div className={`absolute top-12 ${isDecorLeft ? 'left-12 sm:left-14' : 'right-12 sm:right-14'} w-40 sm:w-48 bg-white p-3 rounded-xl shadow-2xl z-50 animate-in zoom-in slide-in-from-${isDecorLeft ? 'left' : 'right'}-5 border-2 border-gray-100`} onClick={(e) => e.stopPropagation()}>
                          <h4 className={`font-black uppercase text-xs ${month.extraGame.color} mb-1`}>
                            {month.extraGame.title}
                          </h4>
                          <button
                            onClick={() => onOpenGame(month.extraGame)}
                            className={`w-full py-1.5 rounded-lg text-[10px] font-black text-white shadow-sm ${month.extraGame.color.replace('text', 'bg').replace('600', '500').replace('700', '500')}`}
                          >
                            JOGAR EXTRA
                          </button>
                      </div>
                  )}
              </div>

              <div className={`absolute top-1/2 transform -translate-y-1/2 ${isStoryLeft ? 'left-2' : 'right-2'} z-20`}>
                  <button
                    disabled={!isMonthStoryUnlocked}
                    onClick={() => onOpenStory(month.story)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg border-2 transition-all duration-500 ${
                      isMonthStoryUnlocked
                        ? 'bg-yellow-400 border-yellow-200 text-yellow-900 animate-bounce cursor-pointer hover:scale-110'
                        : 'bg-black/20 border-white/10 text-white/40 grayscale cursor-not-allowed'
                    }`}
                  >
                      {isMonthStoryUnlocked ? (
                        <BookOpen size={20} className="sm:w-6 sm:h-6" />
                      ) : (
                        <Lock size={20} className="sm:w-6 sm:h-6" />
                      )}
                  </button>
                  {isMonthStoryUnlocked && !isMonthStoryRead && (
                       <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 text-[7px] font-black px-2 py-0.5 rounded-full shadow-sm animate-bounce whitespace-nowrap z-50">
                         HISTÓRIA DESBLOQUEADA!
                       </span>
                  )}
              </div>

              <div className="flex justify-center mb-4 relative z-10">
                <div className="bg-white/10 backdrop-blur px-3 sm:px-4 py-1 rounded-full border border-white/20">
                  <span className="text-white font-bold text-[10px] uppercase tracking-widest">
                    Fim de {month.name}
                  </span>
                </div>
              </div>

              {/* Sinuous Path Container (Match-3 Style) */}
              <div className="relative w-full" style={{ height: `${month.days * 55 + 100}px` }}>
                {/* Cloud borders for depth */}
                <div className="absolute left-0 top-0 bottom-0 w-20 pointer-events-none overflow-hidden opacity-20">
                  <Cloud size={80} className="absolute left-[-20px] top-[10%] text-white fill-white" />
                  <Cloud size={60} className="absolute left-[-10px] top-[30%] text-white fill-white" />
                  <Cloud size={70} className="absolute left-[-15px] top-[60%] text-white fill-white" />
                  <Cloud size={50} className="absolute left-[-5px] top-[85%] text-white fill-white" />
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-20 pointer-events-none overflow-hidden opacity-20">
                  <Cloud size={70} className="absolute right-[-15px] top-[15%] text-white fill-white" />
                  <Cloud size={80} className="absolute right-[-20px] top-[40%] text-white fill-white" />
                  <Cloud size={60} className="absolute right-[-10px] top-[70%] text-white fill-white" />
                  <Cloud size={55} className="absolute right-[-8px] top-[90%] text-white fill-white" />
                </div>

                {/* Sinuous path of days */}
                {Array.from({ length: month.days }, (_, i) => {
                  const dayNum = month.days - i; // Countdown from month.days to 1
                  const dayIndex = i; // Index for path calculation
                  const pathPosition = calculatePathPosition(dayIndex);
                  const specialDate = month.specialDates?.find((sd: any) => sd.day === dayNum);
                  const isCurrentDay = month.name === 'Novembro' && dayNum === 27;

                  return (
                    <div key={dayNum} ref={isCurrentDay ? currentDayRef : null}>
                      <DayNode
                        dayNum={dayNum}
                        month={month}
                        monthIndex={monthIndex}
                        isCurrentDay={isCurrentDay}
                        specialDate={specialDate}
                        onSpecialClick={handleSpecialDateClick}
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
