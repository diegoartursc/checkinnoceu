import React, { memo } from 'react';
import { X, Gamepad2, Brain, Hand, HelpCircle, Sprout, Flame, Music, Sun } from 'lucide-react';
import { GAME_TYPES } from '../../config/gameConfig';

const GAMES = [
  {
    id: GAME_TYPES.MEMORY,
    title: 'Pares da Arca',
    description: 'Encontre os pares dos animais!',
    icon: Brain,
    color: 'from-blue-400 to-blue-600',
    shadow: 'shadow-blue-500/30',
    config: {
      gameType: GAME_TYPES.MEMORY,
      gameData: { title: "Pares da Arca", items: ["🦁", "🦁", "🐘", "🐘", "🦒", "🦒", "🕊️", "🕊️"] },
      bg: "bg-blue-100",
      color: "text-blue-500"
    }
  },
  {
    id: GAME_TYPES.CATCHER,
    title: 'Chuva de Sementes',
    description: 'Pegue as sementes boas!',
    icon: Hand,
    color: 'from-green-400 to-green-600',
    shadow: 'shadow-green-500/30',
    config: {
      gameType: GAME_TYPES.CATCHER,
      gameData: { title: "Chuva de Sementes", target: "🌱", avoid: "🪨" },
      bg: "bg-green-100",
      color: "text-green-500"
    }
  },
  {
    id: GAME_TYPES.QUIZ,
    title: 'Sabedoria',
    description: 'Teste seus conhecimentos!',
    icon: HelpCircle,
    color: 'from-indigo-400 to-indigo-600',
    shadow: 'shadow-indigo-500/30',
    config: {
      gameType: GAME_TYPES.QUIZ,
      gameData: { title: "Quiz Sábio", question: "Quem construiu a arca?", options: ["Noé", "Moisés", "Davi"], answer: 0 },
      bg: "bg-indigo-100",
      color: "text-indigo-500"
    }
  },
  {
    id: GAME_TYPES.HARVEST,
    title: 'Colheita',
    description: 'Colha os frutos do espírito!',
    icon: Sprout,
    color: 'from-orange-400 to-orange-600',
    shadow: 'shadow-orange-500/30',
    config: {
      gameType: GAME_TYPES.HARVEST,
      gameData: { title: "Grande Colheita", target: "🍎", bad: "🐛" },
      bg: "bg-orange-100",
      color: "text-orange-500"
    }
  },
  {
    id: GAME_TYPES.WARMUP,
    title: 'Aquecer',
    description: 'Mantenha o fogo aceso!',
    icon: Flame,
    color: 'from-red-400 to-red-600',
    shadow: 'shadow-red-500/30',
    config: {
      gameType: GAME_TYPES.WARMUP,
      gameData: { title: "Mantenha o Calor", icon: "🔥" },
      bg: "bg-red-100",
      color: "text-red-500"
    }
  },
  {
    id: GAME_TYPES.SEQUENCE,
    title: 'Sons',
    description: 'Repita a sequência musical!',
    icon: Music,
    color: 'from-purple-400 to-purple-600',
    shadow: 'shadow-purple-500/30',
    config: {
      gameType: GAME_TYPES.SEQUENCE,
      gameData: { title: "Jardim Cantante", items: ["🌸", "🌹", "🌻", "🌷"] },
      bg: "bg-purple-100",
      color: "text-purple-500"
    }
  },
  {
    id: GAME_TYPES.REVEAL,
    title: 'Limpar',
    description: 'Revele a imagem escondida!',
    icon: Sun,
    color: 'from-yellow-400 to-yellow-600',
    shadow: 'shadow-yellow-500/30',
    config: {
      gameType: GAME_TYPES.REVEAL,
      gameData: { title: "Céu Limpo", icon: "☀️" },
      bg: "bg-yellow-100",
      color: "text-yellow-500"
    }
  }
];

const GameHub = memo(({ onClose, onSelectGame }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-slate-50 w-full max-w-sm max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col relative">
        {/* Header */}
        <div className="bg-white p-4 flex items-center justify-between border-b border-gray-100 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
              <Gamepad2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 leading-none">Minigames</h2>
              <p className="text-xs text-slate-500 font-medium">Escolha uma diversão!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Game Grid */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {GAMES.map((game) => (
            <button
              key={game.id}
              onClick={() => onSelectGame(game.config)}
              className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center text-white shadow-lg ${game.shadow} group-hover:rotate-6 transition-transform`}>
                <game.icon size={28} strokeWidth={2.5} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-slate-800 text-lg leading-tight">{game.title}</h3>
                <p className="text-xs text-slate-500 font-medium">{game.description}</p>
              </div>
            </button>
          ))}

          <div className="text-center py-4">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mais jogos em breve!</p>
          </div>
        </div>
      </div>
    </div>
  );
});

GameHub.displayName = 'GameHub';

export default GameHub;
