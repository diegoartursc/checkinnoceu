import React, { memo, useCallback } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import HarvestGame from '../../../components/games/HarvestGame';
import GameWrapper from '../wrappers/GameWrapper';

const FazendinhaDaCriacaoGame = memo(() => {
  const { navigate } = useNavigation();

  const handleComplete = useCallback(() => {
    setTimeout(() => {
        navigate('games-hub');
    }, 1000);
  }, [navigate]);

  return (
    <GameWrapper
        title="Fazendinha"
        energyCost={20}
        coinReward={15}
        happinessReward={10}
        onComplete={handleComplete}
        onBack={() => navigate('games-hub')}
    >
        <HarvestGame
            data={{ target: '🍎', bad: '🐛' }}
        />
    </GameWrapper>
  );
});

FazendinhaDaCriacaoGame.displayName = 'FazendinhaDaCriacaoGame';

export default FazendinhaDaCriacaoGame;
