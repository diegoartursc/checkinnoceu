import React, { memo, useState, useEffect } from 'react';
import { Sparkles, Star, Check } from 'lucide-react';

const StreakBonusModal = memo(({ streak, bonusAmount, onClose }) => {
  const [confettiPieces, setConfettiPieces] = useState([]);

  useEffect(() => {
    // Generate fire-colored confetti
    const pieces = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: ['bg-orange-400', 'bg-red-400', 'bg-yellow-400', 'bg-amber-400'][Math.floor(Math.random() * 4)]
    }));
    setConfettiPieces(pieces);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMilestoneMessage = () => {
    if (streak === 7) return 'Uma semana completa!';
    if (streak === 30) return 'Um mês inteiro!';
    if (streak === 90) return 'Três meses seguidos!';
    return 'Continue assim!';
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      {/* Rotating fire rays background */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div
          className="w-[200%] h-[200%] bg-gradient-to-r from-orange-400/20 via-transparent to-red-400/20"
          style={{ animation: 'rotateRays 3s linear infinite' }}
        />
      </div>

      {/* Fire Confetti */}
      {confettiPieces.map(piece => (
        <div
          key={piece.id}
          className={`absolute w-3 h-3 ${piece.color} rounded-sm`}
          style={{
            left: `${piece.left}%`,
            top: '-10px',
            animation: `confetti 3s ease-out ${piece.delay}s infinite`
          }}
        />
      ))}

      {/* Streak Card */}
      <div className="bg-gradient-to-b from-orange-50 to-white rounded-3xl p-8 text-center shadow-[0_0_80px_rgba(251,146,60,0.8)] border-4 border-orange-400 max-w-md w-full relative animate-in zoom-in duration-500">
        {/* Sparkles */}
        <div className="absolute -top-4 -left-4 text-orange-400 animate-pulse">
          <Sparkles size={32} fill="currentColor" />
        </div>
        <div className="absolute -top-4 -right-4 text-red-400 animate-pulse" style={{ animationDelay: '0.3s' }}>
          <Sparkles size={28} fill="currentColor" />
        </div>
        <div className="absolute -bottom-4 -left-4 text-amber-400 animate-pulse" style={{ animationDelay: '0.6s' }}>
          <Sparkles size={24} fill="currentColor" />
        </div>
        <div className="absolute -bottom-4 -right-4 text-orange-400 animate-pulse" style={{ animationDelay: '0.9s' }}>
          <Sparkles size={28} fill="currentColor" />
        </div>

        {/* Fire icon with streak count */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-orange-400 blur-3xl opacity-40 rounded-full animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-orange-400 via-red-500 to-orange-500 p-6 rounded-full shadow-2xl inline-block">
            <div className="text-7xl animate-bounce">🔥</div>
          </div>
        </div>

        {/* Streak text */}
        <div className="mb-6">
          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 mb-2">
            {streak} DIAS
          </h2>
          <p className="text-gray-600 font-bold text-lg mb-2">
            Sequência Incrível! 🎉
          </p>
          <p className="text-orange-600 font-black text-sm uppercase">
            {getMilestoneMessage()}
          </p>
        </div>

        {/* Calendar visualization - last 7 days */}
        <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-4 border-2 border-orange-300 mb-4">
          <p className="text-xs font-bold text-gray-600 mb-3">Últimos 7 dias:</p>
          <div className="flex justify-center gap-2">
            {Array.from({ length: Math.min(streak, 7) }).map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center shadow-lg"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <Check size={20} className="text-white" strokeWidth={3} />
              </div>
            ))}
          </div>
        </div>

        {/* Bonus stars display */}
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 border-2 border-yellow-300 mb-6">
          <p className="text-sm font-bold text-gray-600 mb-2">🎁 Bônus Especial:</p>
          <div className="flex items-center justify-center gap-2">
            <Star size={40} className="fill-yellow-400 text-yellow-400 animate-bounce" />
            <span className="text-5xl font-black text-yellow-600">+{bonusAmount}</span>
          </div>
          <p className="text-xs font-bold text-gray-500 mt-2">Estrelas da Virtude</p>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 text-white font-black text-lg py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all"
        >
          🎯 Continuar Jogando
        </button>
      </div>
    </div>
  );
});

StreakBonusModal.displayName = 'StreakBonusModal';

export default StreakBonusModal;
