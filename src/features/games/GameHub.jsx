import React, { memo } from 'react';
import { X, Play, Brain, Gamepad2 } from 'lucide-react';

const GAMES = [
  {
    id: 'memory',
    title: 'Jogo da Memória',
    description: 'Encontre os pares de cartas bíblicas',
    icon: Brain,
    color: 'bg-violet-500',
    config: { type: 'memory', level: 1 }
  },
  // We can add more games here later
];

const GameHub = memo(({ onSelectGame, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center text-white pt-2">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-3 backdrop-blur-md">
                <Gamepad2 size={32} />
            </div>
            <h2 className="text-2xl font-black tracking-tight">Sala de Jogos</h2>
            <p className="text-violet-100 text-sm font-medium">Divirta-se e aprenda!</p>
          </div>
        </div>

        {/* Games Grid */}
        <div className="p-6">
          <div className="grid gap-4">
            {GAMES.map(game => (
              <button
                key={game.id}
                onClick={() => onSelectGame(game.config)}
                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 hover:border-violet-200 hover:bg-violet-50 transition-all group text-left"
              >
                <div className={`${game.color} w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  <game.icon size={24} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-700 group-hover:text-violet-700 transition-colors">{game.title}</h3>
                  <p className="text-xs text-slate-400 font-medium">{game.description}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-violet-500 group-hover:border-violet-200">
                  <Play size={14} fill="currentColor" />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400 font-medium bg-slate-100 py-2 px-4 rounded-full inline-block">
              Mais jogos em breve! 🚀
            </p>
          </div>
        </div>

      </div>
    </div>
  );
});

GameHub.displayName = 'GameHub';

export default GameHub;
