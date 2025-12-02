import React, { memo, useState } from 'react';
import { Gamepad2, BookOpen, Lightbulb, X, Star, Play } from 'lucide-react';
import Button from '../ui/Button';
import { GAME_TYPES } from '../../config/gameConfig';

const DailyModal = memo(({ dayNumber, monthData, onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0); // 0: Game, 1: Story, 2: Quiz
  const [starsEarned, setStarsEarned] = useState([false, false, false]);
  const [showStepComplete, setShowStepComplete] = useState(false);

  const steps = [
    { name: 'Desafio', icon: Gamepad2, color: 'from-purple-400 to-purple-600' },
    { name: 'História', icon: BookOpen, color: 'from-blue-400 to-blue-600' },
    { name: 'Quiz', icon: Lightbulb, color: 'from-green-400 to-green-600' }
  ];

  const handleStepComplete = () => {
    // Mark current step as complete
    const newStars = [...starsEarned];
    newStars[currentStep] = true;
    setStarsEarned(newStars);
    setShowStepComplete(true);

    // Wait before moving to next step or completing
    setTimeout(() => {
      setShowStepComplete(false);
      if (currentStep < 2) {
        setCurrentStep(currentStep + 1);
      } else {
        // All steps complete!
        onComplete();
      }
    }, 1500);
  };

  const renderStepContent = () => {
    if (currentStep === 0) {
      // Game step
      return (
        <div className="flex flex-col items-center gap-4">
          <div className="text-6xl animate-bounce">{monthData.gameType === GAME_TYPES.MEMORY ? '🎮' : monthData.gameType === GAME_TYPES.CATCHER ? '🎯' : '❓'}</div>
          <h3 className="text-xl font-black text-gray-800">Jogue e Ganhe uma Estrela!</h3>
          <p className="text-gray-600 text-center">{monthData.gameData?.title || 'Complete o desafio do dia'}</p>
          <Button variant="primary" size="lg" onClick={handleStepComplete} icon={Play}>
            Jogar Agora
          </Button>
        </div>
      );
    } else if (currentStep === 1) {
      // Story step
      return (
        <div className="flex flex-col items-center gap-4">
          <div className="text-6xl animate-pulse">📖</div>
          <h3 className="text-xl font-black text-gray-800">{monthData.story?.title || 'História do Dia'}</h3>
          <p className="text-gray-600 text-center max-h-32 overflow-y-auto">
            {monthData.story?.slides?.[0]?.text || 'Descubra a história de hoje!'}
          </p>
          <Button variant="primary" size="lg" onClick={handleStepComplete} icon={BookOpen}>
            Ler História
          </Button>
        </div>
      );
    } else {
      // Quiz step
      return (
        <div className="flex flex-col items-center gap-4">
          <div className="text-6xl animate-bounce">🧠</div>
          <h3 className="text-xl font-black text-gray-800">Quiz Final!</h3>
          <p className="text-gray-600 text-center">Responda corretamente e complete o dia!</p>
          <Button variant="success" size="lg" onClick={handleStepComplete} icon={Lightbulb}>
            Responder Quiz
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-gradient-to-b from-white to-slate-50 rounded-3xl p-8 max-w-md w-full relative shadow-2xl border-4 border-white/50">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Day header */}
        <div className="text-center mb-6">
          <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full font-black text-sm mb-2">
            DIA {dayNumber}
          </div>
          <h2 className="text-2xl font-black text-gray-800">{monthData.name}</h2>
        </div>

        {/* Progress stars */}
        <div className="flex justify-center gap-4 mb-8">
          {starsEarned.map((earned, idx) => (
            <div
              key={idx}
              className={`transition-all duration-500 ${
                idx === currentStep ? 'scale-125 animate-pulse' : ''
              } ${earned ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              <Star
                size={40}
                fill={earned ? 'currentColor' : 'none'}
                strokeWidth={2}
              />
            </div>
          ))}
        </div>

        {/* Step indicator */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((step, idx) => {
            const StepIcon = step.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
                  idx === currentStep
                    ? `bg-gradient-to-r ${step.color} text-white shadow-lg scale-110`
                    : idx < currentStep
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <StepIcon size={16} strokeWidth={2.5} />
                <span className="text-xs font-bold hidden sm:inline">{step.name}</span>
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <div className="min-h-[200px] flex items-center justify-center">
          {showStepComplete ? (
            <div className="text-center animate-in zoom-in duration-300">
              <div className="text-8xl mb-4">⭐</div>
              <h3 className="text-2xl font-black text-green-600">Parabéns!</h3>
              <p className="text-gray-600">Você ganhou uma estrela!</p>
            </div>
          ) : (
            renderStepContent()
          )}
        </div>
      </div>
    </div>
  );
});

DailyModal.displayName = 'DailyModal';

export default DailyModal;
