// src/components/overlays/VictoryModal.tsx
import React, { memo, useState } from 'react';
import { Trophy, Star, BookOpen, Sparkles } from 'lucide-react';

interface VictoryModalProps {
    coins: number;
    onClaim: () => void;
    storyUnlocked: boolean;
}

const VictoryModal = memo(({ coins, onClaim, storyUnlocked }: VictoryModalProps) => {
  const [confettiPieces] = useState<any[]>(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: ['bg-yellow-400', 'bg-pink-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400'][Math.floor(Math.random() * 5)]
    }));
  });
  const [claimed, setClaimed] = useState(false);

  const handleClaim = () => {
    setClaimed(true);
    setTimeout(onClaim, 100);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      {/* Rotating sun rays background */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div
          className="w-[200%] h-[200%] bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20"
          style={{ animation: 'rotateRays 4s linear infinite' }}
        />
      </div>

      {/* Confetti */}
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

      {/* Victory Card */}
      <div className="bg-gradient-to-b from-yellow-50 to-white rounded-3xl p-8 text-center shadow-[0_0_80px_rgba(250,204,21,0.8)] border-4 border-yellow-400 max-w-sm w-full relative animate-in zoom-in duration-500">
        {/* Sparkles */}
        <div className="absolute -top-4 -left-4 text-yellow-400 animate-pulse">
          <Sparkles size={32} fill="currentColor" />
        </div>
        <div className="absolute -top-4 -right-4 text-pink-400 animate-pulse" style={{ animationDelay: '0.3s' }}>
          <Sparkles size={28} fill="currentColor" />
        </div>
        <div className="absolute -bottom-4 -left-4 text-blue-400 animate-pulse" style={{ animationDelay: '0.6s' }}>
          <Sparkles size={24} fill="currentColor" />
        </div>
        <div className="absolute -bottom-4 -right-4 text-purple-400 animate-pulse" style={{ animationDelay: '0.9s' }}>
          <Sparkles size={28} fill="currentColor" />
        </div>

        {/* Trophy icon */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-40 rounded-full animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-yellow-400 via-orange-500 to-yellow-500 p-6 rounded-full shadow-2xl inline-block animate-bounce">
            <Trophy size={64} className="text-white drop-shadow-lg" strokeWidth={2.5} />
          </div>
        </div>

        {/* Victory text */}
        <div className="mb-6">
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 mb-2 animate-pulse">
            VITÓRIA!
          </h2>
          <p className="text-gray-600 font-bold text-lg mb-4">
            Parabéns! 🎉
          </p>

          {/* Coins display */}
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 border-2 border-yellow-300 mb-4">
            <p className="text-sm font-bold text-gray-600 mb-2">Você ganhou:</p>
            <div className="flex items-center justify-center gap-2">
              <Star size={40} className="fill-yellow-400 text-yellow-400 animate-bounce" />
              <span className="text-5xl font-black text-yellow-600">+{coins}</span>
            </div>
            <p className="text-xs font-bold text-gray-500 mt-2">Estrelas da Virtude</p>
          </div>

          {/* Story Unlocked Notification */}
          {storyUnlocked && (
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 border-2 border-purple-300 mb-4 animate-in zoom-in duration-500">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-full animate-bounce">
                  <BookOpen size={24} className="text-white" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-black text-purple-700 uppercase">📖 Bônus Desbloqueado!</p>
                  <p className="text-xs font-bold text-gray-600">Nova história disponível!</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Claim button */}
        <button
          onClick={handleClaim}
          disabled={claimed}
          className="victory-claim-button w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 text-white font-black text-lg py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {claimed ? '✨ Recebido!' : '🎁 Receber Recompensa'}
        </button>
      </div>
    </div>
  );
});

VictoryModal.displayName = 'VictoryModal';

export default VictoryModal;
