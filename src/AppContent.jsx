import React, { memo, useState, useCallback, useEffect } from 'react';
import { useUser } from './contexts/UserContext';
import { useNavigation } from './contexts/NavigationContext';
import MainLayout from './layouts/MainLayout';
import CloudBackground from './components/ui/CloudBackground';
import CheckInScreen from './features/checkin/CheckInScreen';
import MapScreen from './features/map/MapScreen';
import LarScreen from './features/pet/LarScreen';
import MorningPrayerScreen from './features/devotional/MorningPrayerScreen';
import GratitudeScreen from './features/devotional/GratitudeScreen';
import GoodActionScreen from './features/devotional/GoodActionScreen';
import EveningPrayerScreen from './features/devotional/EveningPrayerScreen';
import MonthlyLetterScreen from './features/devotional/MonthlyLetterScreen';
import GameOverlay from './components/modals/GameOverlay';
import StoryOverlay from './components/modals/StoryOverlay';
import VictoryModal from './components/modals/VictoryModal';
import StreakBonusModal from './components/modals/StreakBonusModal';
import FlyingStar from './components/ui/FlyingStar';
import Toast from './components/ui/Toast';
import CaminhoDayModal from './features/map/components/CaminhoDayModal';
import { getCaminhoDevotional } from './data/caminhoDevotionals';

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
  const [currentGameConfig, setCurrentGameConfig] = useState(null);
  const [currentStory, setCurrentStory] = useState(null);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [victoryCoins, setVictoryCoins] = useState(0);
  const [flyingStars, setFlyingStars] = useState([]);
  const [storyUnlocked, setStoryUnlocked] = useState(false);
  const [showStreakBonus, setShowStreakBonus] = useState(false);
  const [streakBonusAmount] = useState(0);
  const [showEveningPrayer, setShowEveningPrayer] = useState(false);
  const [showMonthlyLetter, setShowMonthlyLetter] = useState(false);

  // New States for Caminho Refactor
  const [toastMessage, setToastMessage] = useState(null);
  const [caminhoModalData, setCaminhoModalData] = useState(null);

  // Check if today is completed
  const isCompletedToday = completedDays[lastCompletedDay + 1] !== undefined && lastCompletedDay + 1 > 0;

  // Streak Bonus Check (Effect)
  useEffect(() => {
    // This logic was previously inside handleDayComplete
  }, [streak]);

  // Handlers
  const handleDayComplete = useCallback(() => {
    completeDay(lastCompletedDay + 1);
    addCoins(10);
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
  const handlePrayerComplete = useCallback(() => setDevotionalStep('gratitude'), []);
  const handleGratitudeComplete = useCallback(() => setDevotionalStep('action'), []);
  const handleActionComplete = useCallback(() => {
    completeDevotional();
    // No explicit navigation needed, React state update will trigger re-render to CheckInScreen
  }, [completeDevotional]);

  // --- REFACTORED MAP INTERACTION ---
  const handleDayClick = useCallback((dayIndexInYear, monthData) => {
    const clickedDay = dayIndexInYear + 1;
    const currentDay = lastCompletedDay + 1;

    // 1. Future Day (Locked)
    if (clickedDay > currentDay) {
        setToastMessage("Essa parte do caminho ainda não foi liberada. Continue caminhando dia a dia ✨");
        return;
    }

    // 2. Current Day
    if (clickedDay === currentDay) {
        if (!devotionalComplete) {
            setToastMessage("Antes de seguir pelo Caminho, faça o devocional de hoje na tela HOJE 💛");
            return;
        }
        // If devotional is complete, open modal
        setCaminhoModalData({
            dayNumber: clickedDay,
            monthLabel: monthData.name,
            devotionalData: getCaminhoDevotional(clickedDay)
        });
        return;
    }

    // 3. Past Day (Review)
    if (clickedDay < currentDay) {
         setCaminhoModalData({
            dayNumber: clickedDay,
            monthLabel: monthData.name,
            devotionalData: getCaminhoDevotional(clickedDay)
        });
        return;
    }
  }, [lastCompletedDay, devotionalComplete]);

  return (
    <MainLayout>
      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        isVisible={!!toastMessage}
        onClose={() => setToastMessage(null)}
      />

      {/* Screen Transitions */}
      <div className={`absolute inset-0 transition-all duration-500 ease-in-out ${screen === 'checkin' ? 'translate-x-0 opacity-100' : 'translate-x-[-100%] opacity-0 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100 z-0">
             <CloudBackground />
             <div className="relative z-10 h-full pt-14 sm:pt-16 pb-20">
                {!devotionalComplete ? (
                   /* Devotional Flow (Prayer -> Gratitude -> Action) */
                   <div className="h-full overflow-y-auto">
                     {devotionalStep === 'prayer' && <MorningPrayerScreen onComplete={handlePrayerComplete} />}
                     {devotionalStep === 'gratitude' && <GratitudeScreen onComplete={handleGratitudeComplete} />}
                     {devotionalStep === 'action' && <GoodActionScreen onComplete={handleActionComplete} />}
                   </div>
                ) : (
                   /* Daily Check-in Game/Content */
                   <CheckInScreen
                        currentDay={lastCompletedDay + 1}
                        onCompleteDay={handleDayComplete}
                        isCompletedToday={isCompletedToday}
                   />
                )}
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

      {/* New Caminho Modal */}
      {caminhoModalData && (
        <CaminhoDayModal
          isOpen={!!caminhoModalData}
          onClose={() => setCaminhoModalData(null)}
          dayNumber={caminhoModalData.dayNumber}
          monthLabel={caminhoModalData.monthLabel}
          devotionalData={caminhoModalData.devotionalData}
        />
      )}

      {flyingStars.map(star => <FlyingStar key={star.id} startPos={star.startPos} endPos={star.endPos} onComplete={() => {}} />)}
      {showEveningPrayer && <div className="absolute inset-0 z-50"><EveningPrayerScreen onComplete={() => { setShowEveningPrayer(false); addCoins(5); updatePet({ energy: Math.min(100, pet.energy + 15) }); }} /></div>}
      {showMonthlyLetter && <MonthlyLetterScreen monthNumber={new Date().getMonth() + 1} onClose={() => setShowMonthlyLetter(false)} />}
    </MainLayout>
  );
});

AppContent.displayName = 'AppContent';

export default AppContent;
