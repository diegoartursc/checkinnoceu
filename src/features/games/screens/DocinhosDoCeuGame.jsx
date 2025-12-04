import React, { memo, useCallback } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import CatcherGame from '../../../components/games/CatcherGame';
import GameWrapper from '../wrappers/GameWrapper';
import { useUser } from '../../../contexts/UserContext';

const DocinhosDoCeuGame = memo(() => {
  const { navigate } = useNavigation();
  const { addCoins, updatePet, pet } = useUser(); // Used inside GameWrapper, but imported here to pass if needed, though Wrapper handles logic

  const handleComplete = useCallback(() => {
    // Show win feedback via standard or just navigate back
    // The Wrapper calls this AFTER updating rewards
    setTimeout(() => {
        navigate('games-hub');
    }, 1000);
  }, [navigate]);

  return (
    <GameWrapper
        title="Docinhos do Céu"
        energyCost={15}
        coinReward={10}
        happinessReward={5}
        onComplete={handleComplete}
        onBack={() => navigate('games-hub')}
    >
        <CatcherGame
            data={{ target: '🧁', avoid: '🥦' }}
            // onWin is injected by GameWrapper
        />
    </GameWrapper>
  );
});

DocinhosDoCeuGame.displayName = 'DocinhosDoCeuGame';

export default DocinhosDoCeuGame;
