import React from 'react';
import { Candy, Sprout, Zap } from 'lucide-react';

const GamesMenu = ({ onSelectGame, onBack }) => {
  const games = [
    {
      id: 'docinhos',
      title: 'Docinhos do Céu',
      description: 'Jogo de combinação de doces celestiais',
      icon: <Candy size={48} className="text-pink-500" />,
      color: 'from-pink-100 to-purple-100'
    },
    {
      id: 'fazendinha',
      title: 'Fazendinha da Criação',
      description: 'Plante, regue e colha frutos celestiais',
      icon: <Sprout size={48} className="text-green-500" />,
      color: 'from-green-100 to-teal-100'
    },
    {
      id: 'corrida',
      title: 'Corrida da Luz',
      description: 'Evite obstáculos e colete estrelas',
      icon: <Zap size={48} className="text-yellow-500" />,
      color: 'from-yellow-100 to-orange-100'
    }
  ];

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* CAMADA 1: Fundo Verde Zen (Campo Tranquilo) */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 to-green-200"></div>

      {/* CAMADA 2: Nuvens Sutis (Minimalistas) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-8 left-[10%] text-white/30 animate-pulse gpu-accelerate">
          <div className="text-6xl">☁️</div>
        </div>
        <div className="absolute top-16 right-[15%] text-white/20 animate-pulse gpu-accelerate" style={{ animationDelay: '1s' }}>
          <div className="text-5xl">☁️</div>
        </div>
      </div>

      {/* CAMADA 3: Grama Sutil Base (Silhueta) */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-green-300/20 to-transparent z-[5]"></div>

      {/* Content */}
      <div className="relative z-10 h-full overflow-y-auto pb-24 pt-16 px-4 custom-scrollbar">
        {/* Header - Minimalista */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-green-800">
            Brincadeiras Celestiais
          </h1>
          <p className="text-xs text-green-600 mt-1">
            Escolha sua brincadeira favorita 🎮
          </p>
        </div>

        {/* Voltar Button */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all"
          >
            <span className="font-bold text-green-700">← Voltar ao Lar</span>
          </button>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 gap-4">
          {games.map((game) => (
            <div
              key={game.id}
              className={`bg-gradient-to-br ${game.color} rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all cursor-pointer`}
              onClick={() => onSelectGame(game.id)}
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {game.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-bold text-gray-800">{game.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{game.description}</p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-lg">▶️</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-3 mx-4 mt-8 shadow-sm">
          <p className="text-[10px] text-green-700 text-center font-medium leading-tight">
            🎮 Brincar faz seu amiguinho ficar mais feliz!
          </p>
        </div>
      </div>
    </div>
  );
};

export default GamesMenu;