// src/pages/MapPage.tsx
import React, { useState, useCallback } from 'react';
import MapScreen from '@/features/map/MapScreen';
import GameOverlay from '@/features/game/GameOverlay';
import StoryOverlay from '@/features/story/StoryOverlay';
import VictoryModal from '@/components/overlays/VictoryModal';
import FlyingStar from '@/components/ui/FlyingStar';
import { useUserProgress } from '@/context/UserProgressContext';

const MapPage = () => {
    const { addCoins, unlockStory, unlockedStories } = useUserProgress();
    const [currentGameConfig, setCurrentGameConfig] = useState<any>(null);
    const [currentStory, setCurrentStory] = useState<any>(null);
    const [showVictoryModal, setShowVictoryModal] = useState(false);
    const [victoryCoins, setVictoryCoins] = useState(0);
    const [storyUnlocked, setStoryUnlocked] = useState(false);
    const [flyingStars, setFlyingStars] = useState<any[]>([]);

    const handleWinGame = useCallback(() => {
        const coinsToAdd = 50;
        const storyIdToUnlock = currentGameConfig?.story?.id || currentGameConfig?.seasonEvent?.story?.id;
        let hasUnlockedStory = false;

        if (storyIdToUnlock && !unlockedStories.includes(storyIdToUnlock)) {
            unlockStory(storyIdToUnlock);
            hasUnlockedStory = true;
        }

        setCurrentGameConfig(null);
        setVictoryCoins(coinsToAdd);
        setStoryUnlocked(hasUnlockedStory);
        setShowVictoryModal(true);
    }, [currentGameConfig, unlockedStories, unlockStory]);

    const handleClaimReward = useCallback(() => {
         // Get button position for flying star animation
        const modalButton = document.querySelector('.victory-claim-button');
        const hudStar = document.querySelector('.hud-star');

        if (modalButton && hudStar) {
            const buttonRect = modalButton.getBoundingClientRect();
            const hudRect = hudStar.getBoundingClientRect();

            const startPos = {
                x: buttonRect.left + buttonRect.width / 2 - 16,
                y: buttonRect.top + buttonRect.height / 2 - 16
            };

            const endPos = {
                x: hudRect.left + hudRect.width / 2 - 16,
                y: hudRect.top + hudRect.height / 2 - 16
            };

            const starId = Date.now();
            setFlyingStars(prev => [...prev, { id: starId, startPos, endPos }]);

            setTimeout(() => {
                setFlyingStars(prev => prev.filter(s => s.id !== starId));
                addCoins(victoryCoins);
            }, 1000);
        } else {
             addCoins(victoryCoins);
        }
        setShowVictoryModal(false);
    }, [victoryCoins, addCoins]);

    return (
        <>
            <MapScreen
                onOpenGame={setCurrentGameConfig}
                onOpenStory={setCurrentStory}
            />

            {currentGameConfig && (
                <GameOverlay
                    config={currentGameConfig}
                    onClose={() => setCurrentGameConfig(null)}
                    onWin={handleWinGame}
                />
            )}

            {currentStory && (
                <StoryOverlay
                    story={currentStory}
                    onClose={() => setCurrentStory(null)}
                />
            )}

            {showVictoryModal && (
                <VictoryModal
                    coins={victoryCoins}
                    onClaim={handleClaimReward}
                    storyUnlocked={storyUnlocked}
                />
            )}

             {flyingStars.map(star => (
                <FlyingStar
                  key={star.id}
                  startPos={star.startPos}
                  endPos={star.endPos}
                  onComplete={() => {}}
                />
              ))}
        </>
    );
};

export default MapPage;
