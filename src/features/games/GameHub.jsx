import React, { memo } from 'react';
import { Play, Brain, CheckCircle, Eye, RefreshCcw } from 'lucide-react';
import { GAME_TYPES } from '../../config/gameConfig';

const GAMES = [
  {
    id: 'memory',
    title: 'Memória Bíblica',
    description: 'Encontre os pares dos personagens bíblicos!',
    icon: <Brain size={24} className="text-purple-500" />,
    color: 'bg-purple-100',
    gameType: GAME_TYPES.MEMORY,
    gameData: {
        title: "Memória Bíblica",
        items: ["🦁", "🦁", "🕊️", "🕊️", "🐳", "🐳", "🐑", "🐑"]
    },
    bg: 'bg-purple-100', // Added for GameOverlay header style
    colorText: 'text-purple-500' // Added for GameOverlay header style (note: overlay uses `config.color` as class)
  },
  {
    id: 'quiz',
    title: 'Quiz da Bíblia',
    description: 'Teste seus conhecimentos bíblicos.',
    icon: <CheckCircle size={24} className="text-blue-500" />,
    color: 'bg-blue-100',
    gameType: GAME_TYPES.QUIZ,
    gameData: {
        title: "Quiz da Bíblia",
        question: "Quem construiu a arca?",
        options: ["Noé", "Moisés", "Abraão"],
        answer: 0
    },
    bg: 'bg-blue-100'
  },
  {
    id: 'sequence',
    title: 'Sequência Divina',
    description: 'Memorize a sequência de cores e sons.',
    icon: <RefreshCcw size={24} className="text-green-500" />,
    color: 'bg-green-100',
    gameType: GAME_TYPES.SEQUENCE,
    gameData: {
        title: "Sequência Divina",
        items: ["❤️", "💙", "💛", "💚"]
    },
    bg: 'bg-green-100'
  },
  {
    id: 'reveal',
    title: 'Revelação',
    description: 'Descubra a imagem escondida.',
    icon: <Eye size={24} className="text-orange-500" />,
    color: 'bg-orange-100',
    gameType: GAME_TYPES.REVEAL,
    gameData: {
        title: "Revelação",
        icon: "✝️"
    },
    bg: 'bg-orange-100'
  }
];

const GameHub = memo(({ onSelectGame, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden flex flex-col max-h-[80vh] shadow-2xl animate-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-center relative">
            <h2 className="text-2xl font-black uppercase tracking-wider drop-shadow-md">Sala de Jogos</h2>
            <p className="text-white/80 text-sm mt-1 font-medium">Divirta-se e aprenda!</p>

            <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
            >
                <span className="sr-only">Fechar</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto custom-scrollbar space-y-3 bg-slate-50 flex-1">
            {GAMES.map((game) => (
                <button
                    key={game.id}
                    onClick={() => onSelectGame(game)} // Pass the full game object which now matches config structure
                    className="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group"
                >
                    <div className={`w-14 h-14 rounded-2xl ${game.color} flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform`}>
                        {game.icon}
                    </div>
                    <div className="flex-1 text-left">
                        <h3 className="font-bold text-slate-800 text-lg leading-tight">{game.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 leading-snug">{game.description}</p>
                    </div>
                    <div className="bg-slate-100 p-2 rounded-full text-slate-400 group-hover:bg-violet-100 group-hover:text-violet-500 transition-colors">
                        <Play size={20} fill="currentColor" />
                    </div>
                </button>
            ))}

            {/* Disclaimer */}
            <div className="text-center p-4">
                <p className="text-[10px] text-slate-400">Jogue para ganhar moedas e evoluir seu pet!</p>
            </div>
        </div>
      </div>
    </div>
  );
});

GameHub.displayName = 'GameHub';

export default GameHub;
