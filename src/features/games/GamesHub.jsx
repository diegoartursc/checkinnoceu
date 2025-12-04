import React, { memo } from 'react';
import { ArrowLeft, Zap, Star, Trophy } from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useUser } from '../../contexts/UserContext';
import CloudBackground from '../../components/ui/CloudBackground';

const GameCard = memo(({ title, description, icon, cost, coinReward, happinessReward, color, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full relative overflow-hidden rounded-3xl p-4 transition-all duration-300 border-b-4 text-left group
      ${disabled
        ? 'bg-gradient-to-b from-gray-50 to-gray-100 border-gray-200 opacity-60 cursor-not-allowed'
        : `bg-white border-${color}-200 hover:shadow-lg hover:-translate-y-1 active:scale-95 active:border-b-0 active:translate-y-1`
      }`}
  >
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-${color}-500`}>
      {icon}
    </div>

    <div className="relative z-10">
      <div className="flex flex-wrap gap-2 mb-3">
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-gray-100 shadow-sm text-${color}-600`}>
            <Zap size={12} className="fill-current" />
            <span className="text-[10px] font-bold uppercase tracking-wider">-{cost}</span>
          </div>
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-50 border border-yellow-100 shadow-sm text-yellow-600">
            <Star size={12} className="fill-current" />
            <span className="text-[10px] font-bold uppercase tracking-wider">+{coinReward}</span>
          </div>
      </div>

      <h3 className="text-xl font-black text-gray-800 mb-1 leading-tight">{title}</h3>
      <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-[80%]">{description}</p>

      <div className="mt-4">
         <span className={`
            px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all
            ${disabled
                ? 'bg-gray-200 text-gray-400'
                : `bg-gradient-to-b from-${color}-400 to-${color}-600 text-white shadow-lg shadow-${color}-500/30`
            }
         `}>
            {disabled ? 'Energia Baixa' : 'Jogar Agora'}
         </span>
      </div>
    </div>
  </button>
));

GameCard.displayName = 'GameCard';

const GamesHub = memo(() => {
  const { navigate } = useNavigation();
  const { pet } = useUser();

  const games = [
    {
      id: 'docinhos',
      title: 'Docinhos do Céu',
      description: 'Pegue os doces bons e evite os estragados!',
      screen: 'game-docinhos',
      color: 'pink',
      cost: 15,
      coinReward: 10,
      happinessReward: 5,
      icon: <Star size={80} />
    },
    {
      id: 'fazendinha',
      title: 'Fazendinha',
      description: 'Colha os frutos certos na horta da criação.',
      screen: 'game-fazendinha',
      color: 'orange',
      cost: 20,
      coinReward: 15,
      happinessReward: 10,
      icon: <Trophy size={80} />
    },
    {
      id: 'corrida',
      title: 'Corrida da Luz',
      description: 'Desvie dos obstáculos e alcance a luz!',
      screen: 'game-corrida',
      color: 'blue',
      cost: 25,
      coinReward: 20,
      happinessReward: 15,
      icon: <Zap size={80} />
    }
  ];

  return (
    <div className="h-full flex flex-col relative bg-slate-50 overflow-hidden">
      <CloudBackground />

      {/* Header */}
      <div className="relative z-10 pt-16 pb-4 px-6 bg-white/50 backdrop-blur-sm border-b border-white/20">
        <div className="flex items-center justify-between mb-4">
            <button
            onClick={() => navigate('lar')}
            className="bg-white p-2 rounded-full shadow-sm hover:scale-105 transition-all"
            >
            <ArrowLeft className="text-slate-600" size={24} />
            </button>

            {/* Energy Status */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
                <Zap size={16} className="text-blue-500 fill-blue-500 animate-pulse" />
                <span className="text-sm font-black text-slate-700">{pet?.energy || 0}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Energia</span>
            </div>
        </div>

        <h1 className="text-3xl font-black text-slate-800 mb-1">Hora de Brincar!</h1>
        <p className="text-slate-500 text-sm">Escolha um jogo para ganhar moedas e alegrar seu pet.</p>
      </div>

      {/* Games List */}
      <div className="relative z-10 flex-1 overflow-y-auto px-6 py-6 pb-24">
        <div className="space-y-4">
          {games.map(game => (
            <GameCard
              key={game.id}
              {...game}
              onClick={() => navigate(game.screen)}
              disabled={(pet?.energy || 0) < game.cost}
            />
          ))}
        </div>

        <div className="mt-8 mb-8 text-center">
             <button
                onClick={() => navigate('lar')}
                className="text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-slate-600 transition-colors"
             >
                Voltar para o Quarto
             </button>
        </div>
      </div>
    </div>
  );
});

GamesHub.displayName = 'GamesHub';

export default GamesHub;
