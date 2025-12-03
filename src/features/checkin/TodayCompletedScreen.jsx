import React, { memo } from 'react';
import { Sun } from 'lucide-react';

const TodayCompletedScreen = memo(({ verse }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-in fade-in z-20 relative">
      <div className="w-24 h-24 bg-gradient-to-b from-green-300 to-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(74,222,128,0.6)] border-4 border-green-600 animate-bounce">
        <Sun size={48} className="text-white" />
      </div>
      <h2 className="text-2xl font-black text-white mb-2 drop-shadow-md">Dia Concluído!</h2>
      <p className="text-white/90 text-base mb-8">Volte amanhã para continuar sua jornada.</p>
      {verse && (
        <div className="bg-gradient-to-br from-white/30 to-white/10 p-4 rounded-2xl backdrop-blur-md border-2 border-white/40 text-white shadow-xl max-w-sm">
          <p className="text-xs font-bold opacity-75 uppercase">Versículo do dia:</p>
          <p className="italic font-serif text-base mt-2">"{verse}"</p>
        </div>
      )}
    </div>
  );
});

TodayCompletedScreen.displayName = 'TodayCompletedScreen';

export default TodayCompletedScreen;
