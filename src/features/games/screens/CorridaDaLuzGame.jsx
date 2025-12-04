import React, { memo } from 'react';
import { Clock } from 'lucide-react';
import { useNavigation } from '../../../contexts/NavigationContext';
import GameWrapper from '../wrappers/GameWrapper';

// Temporary placeholder component that simulates a "Win"
const PlaceholderGame = ({ onWin }) => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full">
         <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center">
             <Clock size={64} className="text-blue-300 mb-4 animate-pulse" />
             <h2 className="text-2xl font-black text-blue-800 mb-2">Corrida da Luz</h2>
             <p className="text-blue-600 mb-6">Desvie dos obstáculos e chegue ao fim!</p>
             <button
                onClick={onWin}
                className="bg-blue-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30"
             >
                Simular Vitória
             </button>
         </div>
    </div>
);

const CorridaDaLuzGame = memo(() => {
  const { navigate } = useNavigation();

  const handleComplete = useCallback(() => {
    setTimeout(() => {
        navigate('games-hub');
    }, 1000);
  }, [navigate]);

  return (
    <GameWrapper
        title="Corrida da Luz"
        energyCost={25}
        coinReward={20}
        happinessReward={15}
        onComplete={handleComplete}
        onBack={() => navigate('games-hub')}
    >
        <PlaceholderGame />
    </GameWrapper>
  );
});

CorridaDaLuzGame.displayName = 'CorridaDaLuzGame';

export default CorridaDaLuzGame;
