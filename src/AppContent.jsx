import React, { memo, useState, useCallback, useEffect } from 'react';
import { useUser } from './contexts/UserContext';
import { useNavigation } from './contexts/NavigationContext';
import MainLayout from './layouts/MainLayout';
import CloudBackground from './components/ui/CloudBackground';
import CheckInScreen from './features/checkin/CheckInScreen';
import MapScreen from './features/map/MapScreen';
import LarScreen from './features/pet/LarScreen';
import EveningPrayerScreen from './features/devotional/EveningPrayerScreen';
import MonthlyLetterScreen from './features/devotional/MonthlyLetterScreen';
import GameOverlay from './components/modals/GameOverlay';
import StoryOverlay from './components/modals/StoryOverlay';
import VictoryModal from './components/modals/VictoryModal';
import StreakBonusModal from './components/modals/StreakBonusModal';
import DailyModal from './components/modals/DailyModal';
import FlyingStar from './components/ui/FlyingStar';

const AppContent = memo(() => {
  const {
    coins, addCoins, spendCoins,
    lastCompletedDay, completeDay,
    streak, pet, updatePet, completedDays
  } = useUser();
  const { screen } = useNavigation();

  // Local UI states
  const [currentGameConfig, setCurrentGameConfig] = useState(null);
  const [currentStory, setCurrentStory] = useState(null);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [victoryCoins, setVictoryCoins] = useState(0);
  const [flyingStars, setFlyingStars] = useState([]);
  const [storyUnlocked, setStoryUnlocked] = useState(false);
  const [showStreakBonus, setShowStreakBonus] = useState(false);
  const [streakBonusAmount] = useState(0);
  const [dailyModal, setDailyModal] = useState(null);
  const [showEveningPrayer, setShowEveningPrayer] = useState(false);
  const [showMonthlyLetter, setShowMonthlyLetter] = useState(false);

  // Check if today is completed
  const isCompletedToday = completedDays[lastCompletedDay + 1] !== undefined && lastCompletedDay + 1 > 0;

  // Streak Bonus Check (Effect)
  useEffect(() => {
    // This logic was previously inside handleDayComplete
    // We might need to move this to UserContext or keep it here if it triggers UI
    // For now, let's keep the UI trigger here but the logic is partly in Context
  }, [streak]);

  // Handlers
  const handleDayComplete = useCallback(() => {
    // Context handles logic
    completeDay(lastCompletedDay + 1);

    // UI Feedback
    const coinsReward = 10;
    addCoins(coinsReward);

    // Navigate to Lar or show completion feedback inside CheckInScreen (handled by isCompletedToday prop)
    // We don't force navigation to map anymore per the new flow,
    // the user stays on the completion screen which directs them to Lar.

  }, [lastCompletedDay, completeDay, addCoins]);

  const handleWinGame = useCallback(() => {
    const coinsToAdd = 50;
    setCurrentGameConfig(null);
    setVictoryCoins(coinsToAdd);
    setStoryUnlocked(false);
    setShowVictoryModal(true);
  }, []);

  const handleClaimReward = useCallback(() => {
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

  // Daily Modal
  const handleDayClick = useCallback((dayIndexInYear, monthData) => {
      setDailyModal({ dayNumber: dayIndexInYear + 1, monthData });
  }, []);

  const handleDailyComplete = useCallback(() => {
      if (!dailyModal) return;
      completeDay(dailyModal.dayNumber - 1);
      const reward = 30;
      setVictoryCoins(reward);
      setShowVictoryModal(true);
      setDailyModal(null);
  }, [dailyModal, completeDay]);

  return (
    <MainLayout>
      {/* Screen Transitions */}
      <div className={`transition-all duration-500 ease-in-out ${screen === 'checkin' ? 'relative w-full h-full opacity-100' : 'absolute inset-0 translate-x-[-100%] opacity-0 pointer-events-none'}`}>
          {/* Added overflow-y-auto for CheckIn Screen */}
          <div className="w-full h-full overflow-y-auto">
              <div className="min-h-full bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100 relative">
                 <CloudBackground />
                 <div className="relative z-10 pt-14 sm:pt-16 pb-24 h-full">
                    <CheckInScreen
                        currentDay={lastCompletedDay + 1}
                        onCompleteDay={handleDayComplete}
                        isCompletedToday={isCompletedToday}
                    />
                 </div>
              </div>
          </div>
      </div>

      <div className={`transition-all duration-500 ease-in-out ${screen === 'map' ? 'relative w-full h-full opacity-100' : screen === 'checkin' ? 'absolute inset-0 translate-x-[100%] opacity-0 pointer-events-none' : 'absolute inset-0 translate-x-[-100%] opacity-0 pointer-events-none'}`}>
          <MapScreen
            lastCompletedDay={lastCompletedDay}
            onOpenGame={setCurrentGameConfig}
            onDayClick={handleDayClick}
            completedDays={completedDays}
          />
      </div>

      <div className={`transition-all duration-500 ease-in-out ${screen === 'lar' ? 'relative w-full h-full opacity-100' : 'absolute inset-0 translate-x-[100%] opacity-0 pointer-events-none'}`}>
          {/* Lar Screen usually handles its own scroll or fits in screen, but adding overflow support is safer */}
          <div className="w-full h-full overflow-y-auto">
              <LarScreen
                coins={coins}
                onSpendCoins={spendCoins}
                onOpenEveningPrayer={() => setShowEveningPrayer(true)}
                onOpenMonthlyLetter={() => setShowMonthlyLetter(true)}
              />
          </div>
      </div>

      {/* Modals & Overlays */}
      {currentGameConfig && <GameOverlay config={currentGameConfig} onClose={() => setCurrentGameConfig(null)} onWin={handleWinGame} />}
      {currentStory && <StoryOverlay story={currentStory} onClose={() => setCurrentStory(null)} />}
      {showVictoryModal && <VictoryModal coins={victoryCoins} onClaim={handleClaimReward} storyUnlocked={storyUnlocked} />}
      {showStreakBonus && <StreakBonusModal streak={streak} bonusAmount={streakBonusAmount} onClose={() => setShowStreakBonus(false)} />}
      {dailyModal && <DailyModal dayNumber={dailyModal.dayNumber} monthData={dailyModal.monthData} onComplete={handleDailyComplete} onClose={() => setDailyModal(null)} />}
      {flyingStars.map(star => <FlyingStar key={star.id} startPos={star.startPos} endPos={star.endPos} onComplete={() => {}} />)}
      {showEveningPrayer && <div className="absolute inset-0 z-50 bg-black/80"><EveningPrayerScreen onComplete={() => { setShowEveningPrayer(false); addCoins(5); updatePet({ energy: Math.min(100, pet.energy + 15) }); }} /></div>}
      {showMonthlyLetter && <MonthlyLetterScreen monthNumber={new Date().getMonth() + 1} onClose={() => setShowMonthlyLetter(false)} />}
    </MainLayout>
  );
});

AppContent.displayName = 'AppContent';

export default AppContent;
