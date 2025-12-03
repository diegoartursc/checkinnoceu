import React from 'react';
import { Cloud, Sun, Star } from 'lucide-react';
import CloudBackground from '../../components/ui/CloudBackground';

const WelcomeScreen = ({ onNext }) => {
  return (
    <div className="relative h-full flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Background - Reusing the style from MainLayout/AppContent if possible or just creating a nice one */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-white z-0">
          <CloudBackground />
      </div>

      <div className="relative z-10 max-w-sm w-full bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-xl animate-in fade-in zoom-in duration-700">

        {/* Icon / Illustration */}
        <div className="mb-6 relative">
             <div className="absolute inset-0 bg-yellow-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
             <Sun size={80} className="text-yellow-500 mx-auto relative z-10" />
             <div className="absolute top-0 right-10 text-yellow-400 animate-bounce delay-100">
                 <Star size={24} fill="currentColor" />
             </div>
             <div className="absolute bottom-0 left-10 text-yellow-400 animate-bounce delay-300">
                 <Star size={20} fill="currentColor" />
             </div>
        </div>

        <h1 className="text-3xl font-bold text-sky-600 mb-4">
          Bem-vindo ao<br/>Check-in no Céu!
        </h1>

        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Aqui você vai caminhar no Caminho da Luz com orações, gratidão, boas ações e um amigo especial.
        </p>

        <button
          onClick={onNext}
          className="w-full bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white font-bold text-xl py-4 rounded-2xl shadow-lg transform transition hover:scale-105 active:scale-95 border-b-4 border-sky-600 active:border-b-0 active:translate-y-1"
        >
          Começar!
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
