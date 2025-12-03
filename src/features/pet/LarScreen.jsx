import React, { memo, useState, useMemo, useCallback } from 'react';
import { Cloud, Repeat2, Star } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

const LarScreen = memo(({ onOpenEveningPrayer, onOpenMonthlyLetter }) => {
  // Consume Pet state from Context
  const { pet, coins, feedPet, playWithPet, restPet, updatePet } = useUser();

  // Floating feedback texts
  const [floatingTexts, setFloatingTexts] = useState([]);

  // Pet animation states
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationType, setAnimationType] = useState(null);

  // Pet selector modal
  const [showPetSelector, setShowPetSelector] = useState(false);

  // Available pets
  const petTypes = useMemo(() => [
    { type: 'ovelhinha', name: 'Ovelhinha', emoji: '🐑', emojiAlt: '🐏' },
    { type: 'leao', name: 'Leãozinho', emoji: '🦁', emojiAlt: '🐯' },
    { type: 'pomba', name: 'Pombinha', emoji: '🕊️', emojiAlt: '🦅' }
  ], []);

  // Frutos do Espírito (Gálatas 5:22-23)
  const fruits = useMemo(() => [
    { id: 1, name: 'Maçã do Amor', emoji: '🍎', cost: 1, hunger: 25, verse: 'Amor' },
    { id: 2, name: 'Uva da Alegria', emoji: '🍇', cost: 2, hunger: 30, verse: 'Alegria' },
  ], []);

  // Add floating text animation
  const addFloatingText = useCallback((text, color) => {
    const id = Date.now() + Math.random();
    setFloatingTexts(prev => [...prev, { id, text, color }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 2000);
  }, []);

  // Animate action (2-frame sprite animation)
  const animateAction = useCallback((type) => {
    setIsAnimating(true);
    setAnimationType(type);
    setTimeout(() => {
      setIsAnimating(false);
      setAnimationType(null);
    }, 1500);
  }, []);

  // Change pet type
  const changePet = useCallback((newType, newName) => {
    updatePet({
      type: newType,
      name: newName
    });
  }, [updatePet]);

  // Handle Feed
  const handleFeed = useCallback((fruit) => {
    if (pet.hunger >= 100) {
        addFloatingText('🍽️ Já está cheio!', 'text-orange-500');
        return;
    }

    const success = feedPet(fruit.cost, fruit.hunger);

    if (success) {
        animateAction('eating');
        addFloatingText(`-${fruit.cost} ⭐`, 'text-yellow-500');
        setTimeout(() => addFloatingText(`+${fruit.hunger} 🍽️`, 'text-green-500'), 200);
    } else {
        addFloatingText('⭐ Insuficiente!', 'text-red-500');
    }
  }, [feedPet, pet.hunger, addFloatingText, animateAction]);

  // Handle Play
  const handlePlay = useCallback(() => {
    if (pet.energy < 5) {
      addFloatingText('Sem energia!', 'text-orange-500');
      return;
    }
    if (pet.fun >= 100) {
      addFloatingText('😊 Já está super feliz!', 'text-pink-500');
      return;
    }

    // Play increases fun by 25, costs 5 energy
    playWithPet(25, 5);

    animateAction('playing');
    addFloatingText('-5 ⚡', 'text-blue-500');
    setTimeout(() => addFloatingText('+25 😊', 'text-pink-500'), 200);
  }, [playWithPet, pet.energy, pet.fun, addFloatingText, animateAction]);

  // Handle Sleep/Rest
  const handleSleep = useCallback(() => {
    if (pet.energy >= 100) {
      addFloatingText('⚡ Energia cheia!', 'text-blue-500');
      return;
    }

    // Rest recovers 30 energy
    restPet(30);

    animateAction('sleeping');
    addFloatingText('+30 ⚡', 'text-blue-500');
  }, [pet.energy, restPet, addFloatingText, animateAction]);

  // Determine pet mood
  const getPetMood = useCallback(() => {
    const { hunger, fun, energy } = pet;
    const avg = (hunger + fun + energy) / 3;

    // Check for critical states first (specific emotions)
    if (energy < 20) {
      return { emoji: '😴', mood: 'Muito Cansado', color: 'text-blue-600' };
    }
    if (hunger < 20) {
      return { emoji: '😫', mood: 'Com Fome!', color: 'text-orange-600' };
    }
    if (fun < 20) {
      return { emoji: '😢', mood: 'Triste', color: 'text-gray-600' };
    }

    // Check if multiple stats are low
    const lowStats = [hunger < 40, fun < 40, energy < 40].filter(Boolean).length;
    if (lowStats >= 2) {
      return { emoji: '😠', mood: 'Chateado', color: 'text-red-600' };
    }

    // Check overall mood based on average
    if (avg > 80) {
      return { emoji: '😊', mood: 'Muito Feliz!', color: 'text-green-500' };
    }
    if (avg > 60) {
      return { emoji: '😌', mood: 'Contente', color: 'text-green-600' };
    }
    if (avg > 40) {
      return { emoji: '😐', mood: 'Normal', color: 'text-yellow-600' };
    }

    return { emoji: '😟', mood: 'Precisa de Carinho', color: 'text-orange-500' };
  }, [pet]);

  const mood = getPetMood();

  // Stage Display Text
  const getStageName = (stage) => {
      switch(stage) {
          case 'filhote': return 'Filhote';
          case 'crianca': return 'Criança';
          case 'preadolescente': return 'Pré-adolescente';
          default: return 'Filhote';
      }
  };

  // Pet Size/Scale based on Stage
  const getPetScale = (stage) => {
      switch(stage) {
          case 'filhote': return 'scale-100';
          case 'crianca': return 'scale-110';
          case 'preadolescente': return 'scale-125';
          default: return 'scale-100';
      }
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* CAMADA 1: Fundo Verde Zen (Campo Tranquilo) */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 to-green-200"></div>

      {/* CAMADA 2: Nuvens Sutis (Minimalistas) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-8 left-[10%] text-white/30 animate-pulse gpu-accelerate"><Cloud size={60} fill="currentColor" /></div>
        <div className="absolute top-16 right-[15%] text-white/20 animate-pulse gpu-accelerate" style={{ animationDelay: '1s' }}><Cloud size={50} fill="currentColor" /></div>
      </div>

      {/* CAMADA 3: Grama Sutil Base (Silhueta) */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-green-300/20 to-transparent z-[5]"></div>

      {/* Content */}
      <div className="relative z-10 h-full overflow-y-auto pb-24 pt-16 px-4 custom-scrollbar">
        {/* Header - Minimalista */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-green-800">
            Lar do Amiguinho
          </h1>
          <p className="text-xs text-green-600 mt-1">
            Fase: <span className="font-bold uppercase">{getStageName(pet.stage)}</span> • Dias Bem Cuidados: {pet.daysWellCared || 0}
          </p>
        </div>

        {/* Pet Display - FOCO MINIMALISTA */}
        <div className="relative z-20 mb-6">
          {/* Botão de Trocar Pet - Sutil */}
          <button
            onClick={() => setShowPetSelector(true)}
            className="absolute top-2 right-2 w-9 h-9 bg-white/80 backdrop-blur-sm text-green-600 rounded-full shadow-sm border border-gray-100 hover:shadow-md hover:scale-105 active:scale-95 transition-all z-30"
            title="Trocar amiguinho"
          >
            <Repeat2 size={16} strokeWidth={2} className="mx-auto" />
          </button>

          {/* Floating texts */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30">
            {floatingTexts.map((ft, index) => (
              <div
                key={ft.id}
                className={`absolute font-black text-2xl ${ft.color} drop-shadow-lg`}
                style={{
                  animation: 'floatUp 2s ease-out forwards',
                  left: `${(index % 3 - 1) * 30}px`
                }}
              >
                {ft.text}
              </div>
            ))}
          </div>

          {/* Pet - FOCO PRINCIPAL COM ESPAÇO */}
          <div className="text-center relative py-16">
            {/* Pet emoji com animação de respiração suave */}
            <div
              className={`text-9xl relative z-10 inline-block transition-transform duration-500 ${getPetScale(pet.stage)} ${!isAnimating && 'animate-[bounce_4s_ease-in-out_infinite]'}`}
              style={{
                animation: isAnimating ? 'petBounce 0.3s ease-in-out infinite' : undefined
              }}
            >
              {(() => {
                const currentPetType = petTypes.find(p => p.type === pet.type) || petTypes[0];

                if (isAnimating && animationType === 'eating') {
                  return <span className="inline-block">{currentPetType.emojiAlt}</span>;
                }
                if (isAnimating && animationType === 'playing') {
                  return <span className="inline-block transform rotate-12">{currentPetType.emoji}</span>;
                }
                if (isAnimating && animationType === 'sleeping') {
                  return '😴';
                }
                return currentPetType.emoji;
              })()}
            </div>

            {/* Sombra oval difusa ANCORADA NO CHÃO */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-black/30 rounded-full blur-lg"></div>

            {/* Nome e Mood - Minimalista */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className="text-4xl">{mood.emoji}</span>
              <div className="bg-white/60 backdrop-blur-sm px-4 py-1 rounded-full shadow-sm">
                <p className="font-bold text-sm text-gray-800">{pet.name || 'Amiguinho'}</p>
              </div>
            </div>
          </div>

          {/* Status Bars - MINIMALISTA E SUTIL */}
          <div className="flex justify-center items-center gap-2 px-4 mt-4">
            {/* Hunger */}
            <div className="bg-white/60 backdrop-blur-sm rounded-full px-3 py-2 shadow-sm flex items-center gap-1.5 flex-1 max-w-[120px]">
              <span className="text-sm">🍽️</span>
              <div className="w-full h-1.5 bg-orange-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-400 transition-all duration-500"
                  style={{ width: `${pet.hunger}%` }}
                />
              </div>
            </div>

            {/* Fun (was Happiness) */}
            <div className="bg-white/60 backdrop-blur-sm rounded-full px-3 py-2 shadow-sm flex items-center gap-1.5 flex-1 max-w-[120px]">
              <span className="text-sm">🎾</span>
              <div className="w-full h-1.5 bg-pink-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-pink-400 transition-all duration-500"
                  style={{ width: `${pet.fun}%` }}
                />
              </div>
            </div>

            {/* Energy */}
            <div className="bg-white/60 backdrop-blur-sm rounded-full px-3 py-2 shadow-sm flex items-center gap-1.5 flex-1 max-w-[120px]">
              <span className="text-sm">⚡</span>
              <div className="w-full h-1.5 bg-blue-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400 transition-all duration-500"
                  style={{ width: `${pet.energy}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Painel de Ações - MINIMALISTA E LIMPO */}
        <div className="mt-8 px-4">
          {/* Grid de Botões Limpos */}
          <div className="grid grid-cols-3 gap-4">
            {/* Alimentar (Uses first fruit as default action) */}
            {fruits.slice(0, 1).map(fruit => (
              <button
                key={fruit.id}
                onClick={() => handleFeed(fruit)}
                disabled={coins < fruit.cost}
                className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-all ${
                  coins < fruit.cost
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:shadow-md hover:-translate-y-1 active:scale-95'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="text-4xl">{fruit.emoji}</div>
                  <p className="font-bold text-xs text-gray-700">COMER</p>
                  <div className="bg-yellow-100 rounded-full px-2 py-0.5 flex items-center gap-1">
                    <Star size={10} className="fill-yellow-500 text-yellow-500" />
                    <span className="font-bold text-yellow-700 text-[10px]">{fruit.cost}</span>
                  </div>
                </div>
              </button>
            ))}

            {/* Brincar */}
            <button
              onClick={handlePlay}
              disabled={pet.energy < 5}
              className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-all ${
                pet.energy < 5
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:shadow-md hover:-translate-y-1 active:scale-95'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="text-4xl">🎮</div>
                <p className="font-bold text-xs text-gray-700">BRINCAR</p>
                <div className="bg-blue-100 rounded-full px-2 py-0.5 flex items-center gap-1">
                   <span className="text-[10px] font-bold text-blue-600">-5 ⚡</span>
                </div>
              </div>
            </button>

            {/* Dormir / Acalmar */}
            <button
              onClick={handleSleep}
              disabled={pet.energy >= 100}
              className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-all ${
                pet.energy >= 100
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:shadow-md hover:-translate-y-1 active:scale-95'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="text-4xl">🌙</div>
                <p className="font-bold text-xs text-gray-700">DESCANSAR</p>
                <div className="bg-green-100 rounded-full px-2 py-0.5">
                  <span className="font-bold text-green-700 text-[10px]">+30 ⚡</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Prayer Section - MINIMALISTA */}
        <div className="mt-8 mb-6 px-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Evening Prayer */}
            <button
              onClick={onOpenEveningPrayer}
              className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 active:scale-95 transition-all"
            >
              <div className="text-2xl mb-1">🙏</div>
              <p className="font-bold text-[10px] text-gray-600">Oração da Noite</p>
            </button>

            {/* Monthly Letter */}
            <button
              onClick={onOpenMonthlyLetter}
              className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 active:scale-95 transition-all"
            >
              <div className="text-2xl mb-1">💌</div>
              <p className="font-bold text-[10px] text-gray-600">Cartinha Mensal</p>
            </button>
          </div>
        </div>

        {/* Info Box - MINIMALISTA */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-3 mx-4 shadow-sm">
          <p className="text-[10px] text-green-700 text-center font-medium leading-tight">
             {mood.mood}
          </p>
        </div>
      </div>

      {/* Modal de Seleção de Pet - ZEN */}
      {showPetSelector && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
          onClick={() => setShowPetSelector(false)}
        >
          <div
            className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full relative animate-in zoom-in duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-6">
              <Repeat2 size={36} className="mx-auto mb-3 text-green-600" strokeWidth={2} />
              <h2 className="text-2xl font-bold text-gray-800">
                Trocar Amiguinho
              </h2>
              <p className="text-xs text-gray-500 mt-2">Escolha seu companheiro:</p>
            </div>

            {/* Pet Options */}
            <div className="flex gap-4 justify-center mb-6">
              {petTypes.map(petOption => (
                <button
                  key={petOption.type}
                  onClick={() => {
                    changePet(petOption.type, petOption.name);
                    setShowPetSelector(false);
                  }}
                  className={`p-4 rounded-2xl border transition-all ${
                    pet.type === petOption.type
                      ? 'bg-green-100 border-green-400 scale-105 shadow-lg'
                      : 'bg-gray-50 border-gray-200 hover:scale-105 hover:shadow-md active:scale-95'
                  }`}
                >
                  <div className="text-5xl mb-2">{petOption.emoji}</div>
                  <p className="text-xs font-bold text-gray-700">{petOption.name}</p>
                </button>
              ))}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowPetSelector(false)}
              className="w-full bg-gray-100 text-gray-700 font-bold text-sm py-3 rounded-2xl border border-gray-200 hover:bg-gray-200 hover:shadow-md active:scale-95 transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

LarScreen.displayName = 'LarScreen';

export default LarScreen;
