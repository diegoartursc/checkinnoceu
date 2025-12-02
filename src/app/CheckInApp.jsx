import React, { memo } from 'react';
import { useAppState } from '../context/AppStateContext';
import { useNavigation } from '../hooks/useNavigation';
import MainLayout from '../layouts/MainLayout';
import CloudBackground from '../components/ui/CloudBackground';
import CheckInScreen from '../screens/CheckInScreen';
import MapScreen from '../screens/MapScreen';
import LarScreen from '../screens/LarScreen';
import MorningPrayerScreen from '../screens/devotional/MorningPrayerScreen';
import GratitudeScreen from '../screens/devotional/GratitudeScreen';
import GoodActionScreen from '../screens/devotional/GoodActionScreen';
import EveningPrayerScreen from '../screens/devotional/EveningPrayerScreen';
import MonthlyLetterScreen from '../screens/devotional/MonthlyLetterScreen';
import GameOverlay from '../components/modals/GameOverlay';
import StoryOverlay from '../components/modals/StoryOverlay';
import VictoryModal from '../components/modals/VictoryModal';
import StreakBonusModal from '../components/modals/StreakBonusModal';
import DailyModal from '../components/modals/DailyModal';
import FlyingStar from '../components/ui/FlyingStar';

const CheckInApp = memo(() => {
  const {
    // State
    coins, addCoins, spendCoins,
    lastCompletedDay, completeDay,
    streak, pet, updatePet, completedDays,
    devotionalComplete, completeDevotional,

    // UI State
    devotionalStep, setDevotionalStep,
    currentGameConfig, setCurrentGameConfig,
    currentStory, setCurrentStory,
    showVictoryModal, setShowVictoryModal,
    victoryCoins, setVictoryCoins,
    flyingStars, setFlyingStars,
    storyUnlocked, setStoryUnlocked,
    showStreakBonus, setShowStreakBonus,
    streakBonusAmount,
    dailyModal, setDailyModal,
    showEveningPrayer, setShowEveningPrayer,
    showMonthlyLetter, setShowMonthlyLetter
  } = useAppState();

  const { screen, navigate } = useNavigation();

  // Check if today is completed
  const isCompletedToday = completedDays[lastCompletedDay + 1] !== undefined && lastCompletedDay + 1 > 0;

  // Handlers
  const handleDayComplete = () => {
    // Context handles logic
    completeDay(lastCompletedDay + 1);

    // UI Feedback
    const coinsReward = 10;
    addCoins(coinsReward);

    setTimeout(() => navigate('map'), 2000);
  };

  const handleWinGame = () => {
    const coinsToAdd = 50;
    setCurrentGameConfig(null);
    setVictoryCoins(coinsToAdd);
    setStoryUnlocked(false);
    setShowVictoryModal(true);
  };

  const handleClaimReward = () => {
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
  };

  // Devotional Flow
  const handlePrayerComplete = () => setDevotionalStep('gratitude');
  const handleGratitudeComplete = () => setDevotionalStep('action');
  const handleActionComplete = () => {
    completeDevotional();
  };

  // Daily Modal
  const handleDayClick = (dayIndexInYear, monthData) => {
      setDailyModal({ dayNumber: dayIndexInYear + 1, monthData });
  };

  const handleDailyComplete = () => {
      if (!dailyModal) return;
      completeDay(dailyModal.dayNumber - 1);
      const reward = 30;
      setVictoryCoins(reward);
      setShowVictoryModal(true);
      setDailyModal(null);
  };


  // Devotional Check
  if (!devotionalComplete) {
    return (
      <div className="w-full min-h-screen max-w-md mx-auto overflow-hidden relative font-sans shadow-2xl">
        {devotionalStep === 'prayer' && <MorningPrayerScreen onComplete={handlePrayerComplete} />}
        {devotionalStep === 'gratitude' && <GratitudeScreen onComplete={handleGratitudeComplete} />}
        {devotionalStep === 'action' && <GoodActionScreen onComplete={handleActionComplete} />}
      </div>
    );
  }

  return (
    <MainLayout>
      {/* Screen Transitions */}
      <div className={`absolute inset-0 transition-all duration-500 ease-in-out ${screen === 'checkin' ? 'translate-x-0 opacity-100' : 'translate-x-[-100%] opacity-0 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100 z-0">
             <CloudBackground />
             <div className="relative z-10 h-full pt-14 sm:pt-16 pb-20">
                <CheckInScreen
                    currentDay={lastCompletedDay + 1}
                    onCompleteDay={handleDayComplete}
                    isCompletedToday={isCompletedToday}
                />
             </div>
          </div>
      </div>

      <div className={`absolute inset-0 transition-all duration-500 ease-in-out ${screen === 'map' ? 'translate-x-0 opacity-100' : screen === 'checkin' ? 'translate-x-[100%] opacity-0 pointer-events-none' : 'translate-x-[-100%] opacity-0 pointer-events-none'}`}>
          <MapScreen
            lastCompletedDay={lastCompletedDay}
            onOpenGame={setCurrentGameConfig}
            onDayClick={handleDayClick}
            completedDays={completedDays}
          />
      </div>

      <div className={`absolute inset-0 transition-all duration-500 ease-in-out ${screen === 'lar' ? 'translate-x-0 opacity-100' : 'translate-x-[100%] opacity-0 pointer-events-none'}`}>
          <LarScreen
            coins={coins}
            onSpendCoins={spendCoins}
            onOpenEveningPrayer={() => setShowEveningPrayer(true)}
            onOpenMonthlyLetter={() => setShowMonthlyLetter(true)}
          />
      </div>

      {/* Modals & Overlays */}
      {currentGameConfig && <GameOverlay config={currentGameConfig} onClose={() => setCurrentGameConfig(null)} onWin={handleWinGame} />}
      {currentStory && <StoryOverlay story={currentStory} onClose={() => setCurrentStory(null)} />}
      {showVictoryModal && <VictoryModal coins={victoryCoins} onClaim={handleClaimReward} storyUnlocked={storyUnlocked} />}
      {showStreakBonus && <StreakBonusModal streak={streak} bonusAmount={streakBonusAmount} onClose={() => setShowStreakBonus(false)} />}
      {dailyModal && <DailyModal dayNumber={dailyModal.dayNumber} monthData={dailyModal.monthData} onComplete={handleDailyComplete} onClose={() => setDailyModal(null)} />}
      {flyingStars.map(star => <FlyingStar key={star.id} startPos={star.startPos} endPos={star.endPos} onComplete={() => {}} />)}
      {showEveningPrayer && <div className="absolute inset-0 z-50"><EveningPrayerScreen onComplete={() => { setShowEveningPrayer(false); addCoins(5); updatePet({ energy: Math.min(100, pet.energy + 15) }); }} /></div>}
      {showMonthlyLetter && <MonthlyLetterScreen monthNumber={new Date().getMonth() + 1} onClose={() => setShowMonthlyLetter(false)} />}
    </MainLayout>
  );
});

CheckInApp.displayName = 'CheckInApp';

export default CheckInApp;
