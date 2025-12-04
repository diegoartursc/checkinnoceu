import React, { memo, useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Zap, Clock, AlertTriangle } from 'lucide-react';
import { useUser } from '../../../contexts/UserContext';
import { useNavigation } from '../../../contexts/NavigationContext';

const GameWrapper = memo(({
  title,
  energyCost,
  coinReward,
  happinessReward,
  children,
  onComplete, // Called when game logic (win) happens
  onBack
}) => {
  const { pet, updatePet, addCoins } = useUser();
  const [hasStarted, setHasStarted] = useState(false);
  const [showEnergyWarning, setShowEnergyWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  // Initial Energy Check & Deduction
  useEffect(() => {
    if (hasStarted) return;

    if ((pet?.energy || 0) < energyCost) {
      setShowEnergyWarning(true);
    } else {
      // Deduct energy immediately
      updatePet({
        energy: Math.max(0, (pet?.energy || 0) - energyCost)
      });
      setHasStarted(true);
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer
  useEffect(() => {
    if (!hasStarted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onBack(); // Timeout - go back
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, onBack]);

  const handleGameCompletion = useCallback(() => {
    // Add rewards
    addCoins(coinReward);
    updatePet({
      happiness: Math.min(100, (pet?.happiness || 0) + happinessReward)
    });

    // Call parent handler
    onComplete();
  }, [coinReward, happinessReward, addCoins, updatePet, pet?.happiness, onComplete]);

  // Format time
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (showEnergyWarning) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-white p-6 rounded-3xl text-center max-w-sm w-full shadow-2xl scale-100 animate-in zoom-in-95">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap size={40} className="text-yellow-500 fill-yellow-500 animate-pulse" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-2">Energia Baixa!</h3>
          <p className="text-slate-600 mb-6 font-medium">
            Seu amiguinho precisa de energia para brincar. Que tal dormir um pouco?
          </p>
          <div className="bg-slate-50 rounded-xl p-3 mb-6 flex items-center justify-center gap-2">
            <span className="text-sm font-bold text-slate-500">Necessário:</span>
            <div className="flex items-center gap-1">
                <span className="text-lg font-black text-slate-800">{energyCost}</span>
                <Zap size={16} className="text-blue-500 fill-blue-500" />
            </div>
          </div>
          <button
            onClick={onBack}
            className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-700 transition-all active:scale-95"
          >
            Entendi, vou descansar
          </button>
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return <div className="h-full bg-slate-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div></div>;
  }

  return (
    <div className="h-full flex flex-col relative bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="pt-14 pb-2 px-4 flex items-center justify-between z-20 bg-white/80 backdrop-blur-sm border-b border-slate-100">
        <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
            <ArrowLeft className="text-slate-600" size={24} />
        </button>

        <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</span>
            <div className="flex items-center gap-1 text-slate-300 text-[10px]">
                <Clock size={10} />
                <span>{minutes}:{seconds.toString().padStart(2, '0')}</span>
            </div>
        </div>

        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Game Content */}
      <div className="flex-1 relative z-10">
        {/* Pass handleGameCompletion to children instead of raw onComplete */}
        {React.cloneElement(children, { onWin: handleGameCompletion })}
      </div>
    </div>
  );
});

GameWrapper.displayName = 'GameWrapper';

export default GameWrapper;
