import React, { memo, useState, useEffect, useMemo } from 'react';
import { CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button';

// Boa Ação do Dia
const GoodActionScreen = memo(({ onComplete }) => {
  const [currentMission, setCurrentMission] = useState(null);
  const [completed, setCompleted] = useState(false);

  const missions = useMemo(() => [
    { id: 1, icon: '🤝', text: 'Ajude sua família em alguma tarefa', value: 'ajudar' },
    { id: 2, icon: '👋', text: 'Dê bom dia para alguém especial', value: 'saudar' },
    { id: 3, icon: '🎁', text: 'Compartilhe um brinquedo ou lanche', value: 'compartilhar' },
    { id: 4, icon: '😊', text: 'Faça alguém sorrir hoje', value: 'alegrar' },
    { id: 5, icon: '🙌', text: 'Agradeça por algo que recebeu', value: 'agradecer' },
    { id: 6, icon: '🤗', text: 'Convide alguém para brincar junto', value: 'incluir' },
  ], []);

  useEffect(() => {
    // Seleciona missão aleatória
    const today = new Date().getDate();
    // Deterministic based on date to avoid flicker, or random on mount
    // Since this is "Good Action of the DAY", using date is better
    const missionIndex = today % missions.length;
    setCurrentMission(missions[missionIndex]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMarkComplete = () => {
    setCompleted(true);
    setTimeout(onComplete, 1500);
  };

  if (!currentMission) return null;

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 relative overflow-y-auto">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-100 via-emerald-50 to-teal-50" />

      <div className="relative z-10 max-w-md w-full px-4">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="text-5xl sm:text-7xl mb-3 sm:mb-4 animate-bounce">{currentMission.icon}</div>
          <h1 className="text-2xl sm:text-3xl font-black text-green-900 mb-2 sm:mb-3">
            Boa Ação do Dia
          </h1>
          <div className="h-1 w-20 sm:w-24 bg-gradient-to-r from-green-400 to-emerald-400 mx-auto rounded-full mb-3 sm:mb-4" />
        </div>

        {/* Missão */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-green-200 mb-6 sm:mb-8">
          <p className="text-gray-800 text-lg sm:text-xl font-bold text-center leading-relaxed">
            {currentMission.text}
          </p>
        </div>

        {/* Status */}
        {!completed ? (
          <>
            <Button
              variant="success"
              size="lg"
              onClick={handleMarkComplete}
              icon={CheckCircle}
              className="w-full mb-4"
            >
              Marcar como Feita ✅
            </Button>
            <p className="text-center text-green-700 text-sm font-medium">
              💚 Fazer o bem ilumina o mundo!
            </p>
          </>
        ) : (
          <div className="text-center animate-in zoom-in duration-500">
            <div className="text-8xl mb-4">⭐</div>
            <h2 className="text-2xl font-black text-green-600 mb-2">
              Parabéns!
            </h2>
            <p className="text-green-700">
              Você ganhou +10 de Luz! ✨
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

GoodActionScreen.displayName = 'GoodActionScreen';

export default GoodActionScreen;
