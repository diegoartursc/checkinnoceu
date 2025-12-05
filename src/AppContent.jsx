import React, { memo, useState, useCallback, useEffect } from 'react';
import { useUser } from './contexts/UserContext';
import { useNavigation } from './contexts/NavigationContext';
import MainLayout from './layouts/MainLayout';
import CloudBackground from './components/ui/CloudBackground';
import CheckInScreen from './features/checkin/CheckInScreen';
import MapScreen from './features/map/MapScreen';
import LarScreen from './features/pet/LarScreen';
import SettingsScreen from './features/settings/SettingsScreen';
import MorningPrayerScreen from './features/devotional/MorningPrayerScreen';
import GratitudeScreen from './features/devotional/GratitudeScreen';
import GoodActionScreen from './features/devotional/GoodActionScreen';
import EveningPrayerScreen from './features/devotional/EveningPrayerScreen';
import MonthlyLetterScreen from './features/devotional/MonthlyLetterScreen';
import GameHub from './features/games/GameHub';
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
    streak, pet, updatePet, completedDays,
    devotionalComplete, completeDevotional
  } = useUser();
  const { screen, navigate } = useNavigation();

  // Local UI states
  const [devotionalStep, setDevotionalStep] = useState('prayer'); // prayer, gratitude, action
  const [showDevotionalFlow, setShowDevotionalFlow] = useState(false);
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
  const [showGameHub, setShowGameHub] = useState(false);

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

    // Check for streak bonus (simplified simulation for now)
    // In a real app, completeDay would return info about streak changes
    // Here we can check streak in useEffect or trust the context

    setTimeout(() => navigate('map'), 2000);
  }, [lastCompletedDay, completeDay, addCoins, navigate]);

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

  // Devotional Flow
  const startDevotionalFromCheckIn = useCallback(() => {
    if (devotionalComplete) return;
    setDevotionalStep('prayer');
    setShowDevotionalFlow(true);
  }, [devotionalComplete]);

  const handlePrayerComplete = useCallback(() => setDevotionalStep('gratitude'), []);
  const handleGratitudeComplete = useCallback(() => setDevotionalStep('action'), []);
  const handleActionComplete = useCallback(() => {
    completeDevotional();
    setShowDevotionalFlow(false);
  }, [completeDevotional]);

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


  if (showDevotionalFlow && !devotionalComplete) {
    return (
      <MainLayout>
        {/* Added overflow-y-auto wrapper for Devotional Screens */}
        <div className="w-full h-full overflow-y-auto">
          <div className="min-h-full pt-14 sm:pt-16 pb-24">
            {devotionalStep === 'prayer' && <MorningPrayerScreen onComplete={handlePrayerComplete} />}
            {devotionalStep === 'gratitude' && <GratitudeScreen onComplete={handleGratitudeComplete} />}
            {devotionalStep === 'action' && <GoodActionScreen onComplete={handleActionComplete} />}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Screen Transitions */}
      {screen === 'checkin' && (
        <div className="relative w-full h-full animate-in fade-in duration-500">
            {/* Added overflow-y-auto for CheckIn Screen */}
            <div className="w-full h-full overflow-y-auto">
                <div className="min-h-full bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100 relative">
                   <CloudBackground />
                   <div className="relative z-10 pt-14 sm:pt-16 pb-24">
                      <CheckInScreen
                          currentDay={lastCompletedDay + 1}
                          onCompleteDay={handleDayComplete}
                          isCompletedToday={isCompletedToday}
                          devotionalComplete={devotionalComplete}
                          onStartDevotional={startDevotionalFromCheckIn}
                      />
                   </div>
                </div>
            </div>
        </div>
      )}

      {screen === 'map' && (
        <div className="relative w-full h-full animate-in fade-in duration-500">
            <MapScreen
              lastCompletedDay={lastCompletedDay}
              onOpenGame={setCurrentGameConfig}
              onDayClick={handleDayClick}
              completedDays={completedDays}
            />
        </div>
      )}

      {screen === 'lar' && (
        <div className="relative w-full h-full animate-in fade-in duration-500">
            {/* Lar Screen usually handles its own scroll or fits in screen, but adding overflow support is safer */}
            <div className="w-full h-full overflow-y-auto">
                <LarScreen
                  coins={coins}
                  onSpendCoins={spendCoins}
                  onOpenEveningPrayer={() => setShowEveningPrayer(true)}
                  onOpenMonthlyLetter={() => setShowMonthlyLetter(true)}
                  onOpenGames={() => setShowGameHub(true)}
                />
            </div>
        </div>
      )}

      {screen === 'settings' && (
        <div className="relative w-full h-full animate-in fade-in duration-500">
             <SettingsScreen />
        </div>
      )}

      {/* Modals & Overlays */}
      {showGameHub && (
        <GameHub
          onClose={() => setShowGameHub(false)}
          onSelectGame={(config) => {
            setShowGameHub(false);
            setCurrentGameConfig(config);
          }}
        />
      )}
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
