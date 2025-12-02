import React, { useState, memo } from 'react';
import { Music, ArrowRight } from 'lucide-react';
import { Button } from '../ui';

const EveningPrayerScreen = memo(({ onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const prayer = {
    title: "Oração da Noite",
    text: "Boa noite, Jesus! Obrigado por este dia maravilhoso. Obrigado por ter cuidado de mim e da minha família. Perdoa se eu fiz algo errado hoje. Me dá um sono tranquilo e me protege enquanto eu durmo. Que amanhã seja um dia cheio de alegria e amor. Amém! 🌙",
    icon: "🌙"
  };

  const handlePlayAudio = () => {
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background noturno com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-800 to-blue-900" />

      {/* Estrelas piscando */}
      <div className="absolute inset-0 overflow-hidden opacity-60">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-md w-full px-4">
        {/* Ícone da lua */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-block text-6xl sm:text-8xl animate-bounce-slow mb-3 sm:mb-4">
            {prayer.icon}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-yellow-100 mb-2">
            {prayer.title}
          </h1>
          <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full" />
        </div>

        {/* Caixa da oração */}
        <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-purple-300/30 mb-6 sm:mb-8">
          <p className="text-white text-base sm:text-lg leading-relaxed font-medium text-center">
            {prayer.text}
          </p>
        </div>

        {/* Botões */}
        <div className="flex flex-col gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={handlePlayAudio}
            icon={Music}
            disabled={isPlaying}
            className="w-full"
          >
            {isPlaying ? 'Tocando...' : 'Ouvir Oração 🎵'}
          </Button>

          <Button
            variant="success"
            size="lg"
            onClick={onComplete}
            icon={ArrowRight}
            className="w-full"
          >
            Finalizar e Descansar 💤
          </Button>
        </div>

        {/* Mensagem suave */}
        <p className="text-center text-purple-200 text-sm mt-6 font-medium">
          ⭐ Terminar o dia com oração traz paz para o sono
        </p>
      </div>
    </div>
  );
});

EveningPrayerScreen.displayName = 'EveningPrayerScreen';

export default EveningPrayerScreen;
