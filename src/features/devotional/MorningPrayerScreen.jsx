import React, { memo, useState } from 'react';
import { Music, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';

// Oração da Manhã - Primeira tela ao abrir o app
const MorningPrayerScreen = memo(({ onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const prayer = {
    title: "Oração da Manhã",
    text: "Bom dia, Jesus! Obrigado por mais um dia de vida. Obrigado pela minha família, pelos meus amigos e por tudo de bom que vou viver hoje. Me ajuda a ser uma criança boa, a compartilhar, a ser gentil e a fazer o bem. Amém! 🙏",
    icon: "☀️"
  };

  const handlePlayAudio = () => {
    setIsPlaying(true);
    // Simula áudio tocando
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 relative">
      {/* Background com gradiente suave */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-100 via-orange-50 to-yellow-50" />

      {/* Raios de sol animados */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-yellow-300 to-transparent animate-spin-slow" />
      </div>

      <div className="relative z-10 max-w-md w-full my-auto">
        {/* Ícone do sol */}
        <div className="text-center mb-6">
          <div className="inline-block text-6xl sm:text-8xl animate-bounce-slow mb-4">
            {prayer.icon}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-orange-900 mb-2">
            {prayer.title}
          </h1>
          <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-orange-400 to-yellow-400 mx-auto rounded-full" />
        </div>

        {/* Caixa da oração */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-orange-200 mb-6 sm:mb-8">
          <p className="text-gray-800 text-base sm:text-lg leading-relaxed font-medium text-center">
            {prayer.text}
          </p>
        </div>

        {/* Botões */}
        <div className="flex flex-col gap-4">
          <Button
            variant="warning"
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
            Continuar ✨
          </Button>
        </div>

        {/* Mensagem suave */}
        <p className="text-center text-orange-700 text-sm mt-6 font-medium">
          💛 Começar o dia com oração traz luz para o coração
        </p>
      </div>
    </div>
  );
});

MorningPrayerScreen.displayName = 'MorningPrayerScreen';

export default MorningPrayerScreen;
