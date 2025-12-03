import React from 'react';
import { useUser } from '../../contexts/UserContext';
import { PET_TYPES } from '../../constants/pets';
import { Heart, Sparkles } from 'lucide-react';
import CloudBackground from '../../components/ui/CloudBackground';

const OnboardingSummaryScreen = () => {
  const { completeOnboarding, pet } = useUser();

  const handleStart = () => {
    completeOnboarding();
  };

  // Try to find the pet emoji, fallback to generic
  const petEmoji = PET_TYPES.find(p => p.type === pet?.type)?.emoji || '🐾';

  return (
    <div className="relative h-full flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-white to-sky-100 z-0">
         <CloudBackground />
      </div>

      <div className="relative z-10 max-w-sm w-full bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-700">

        <div className="mb-6 relative inline-block">
             <div className="absolute inset-0 bg-pink-200 rounded-full blur-xl opacity-60 animate-pulse"></div>
             <div className="relative z-10 flex items-center justify-center gap-2">
                 <span className="text-6xl animate-bounce" style={{ animationDelay: '0s' }}>🧍</span>
                 <Heart className="text-pink-500 animate-pulse" size={32} fill="currentColor" />
                 <span className="text-6xl animate-bounce" style={{ animationDelay: '0.2s' }}>{petEmoji}</span>
             </div>
        </div>

        <h1 className="text-2xl font-bold text-sky-800 mb-4">
          Pronto!
        </h1>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Agora você e seu amigo caminham juntos no <span className="text-sky-600 font-bold">Caminho da Luz</span>.
        </p>

        <div className="bg-sky-50 rounded-xl p-4 mb-8 text-left space-y-3">
             <div className="flex items-start gap-3">
                 <div className="mt-1"><Sparkles size={16} className="text-yellow-500" /></div>
                 <p className="text-sm text-gray-600">Todo dia vamos orar, agradecer e fazer uma boa ação.</p>
             </div>
             <div className="flex items-start gap-3">
                 <div className="mt-1"><Heart size={16} className="text-pink-500" /></div>
                 <p className="text-sm text-gray-600">Assim seu mascote fica feliz e seu caminho brilha mais!</p>
             </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white font-bold text-xl py-4 rounded-2xl shadow-lg transform transition hover:scale-105 active:scale-95 border-b-4 border-sky-600 active:border-b-0 active:translate-y-1"
        >
          Vamos começar!
        </button>
      </div>
    </div>
  );
};

export default OnboardingSummaryScreen;
