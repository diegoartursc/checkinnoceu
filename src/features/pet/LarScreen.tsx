// src/features/pet/LarScreen.tsx
import React, { memo, useState, useEffect, useMemo, useCallback } from 'react';
import { Repeat2, Star } from 'lucide-react';
import CloudBackground from '@/components/ui/CloudBackground';
import { useUserProgress } from '@/context/UserProgressContext';

interface Pet {
    type: string;
    name: string;
    hunger: number;
    happiness: number;
    energy: number;
    lastUpdate: number;
}

const LarScreen = memo(() => {
  const { coins, spendCoins } = useUserProgress();
  // Pet state with localStorage persistence
  const [pet, setPet] = useState<Pet>(() => {
    const saved = localStorage.getItem('checkin_pet');
    if (saved) {
      const parsedPet = JSON.parse(saved);
      // Calculate decay immediately on load
      const now = Date.now();
      const hoursPassed = (now - parsedPet.lastUpdate) / (1000 * 60 * 60);

      if (hoursPassed > 0.1) {
          const hungerDecay = Math.floor(hoursPassed * 5);
          const happinessDecay = Math.floor(hoursPassed * 3);
          const energyDecay = Math.floor(hoursPassed * 4);

          return {
            ...parsedPet,
            hunger: Math.max(0, parsedPet.hunger - hungerDecay),
            happiness: Math.max(0, parsedPet.happiness - happinessDecay),
            energy: Math.max(0, parsedPet.energy - energyDecay),
            lastUpdate: now
          };
      }
      return parsedPet;
    }
    return {
      type: 'ovelhinha',
      name: 'Ovelhinha',
      hunger: 100,
      happiness: 100,
      energy: 100,
      lastUpdate: Date.now()
    };
  });

  // Floating feedback texts
  const [floatingTexts, setFloatingTexts] = useState<any[]>([]);

  // Pet animation states
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationType, setAnimationType] = useState<string | null>(null);

  // Pet selector modal
  const [showPetSelector, setShowPetSelector] = useState(false);

  // Available pets
  const petTypes = useMemo(() => [
    { type: 'ovelhinha', name: 'Ovelhinha', emoji: '🐑', emojiAlt: '🐏' },
    { type: 'leao', name: 'Leãozinho', emoji: '🦁', emojiAlt: '🐯' },
    { type: 'pomba', name: 'Pombinha', emoji: '🕊️', emojiAlt: '🦅' }
  ], []);

  // Get habitat decoration based on pet type
  const getHabitatDecoration = useCallback(() => {
    switch (pet.type) {
      case 'ovelhinha':
        // Campo/Fazenda
        return (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-30 pointer-events-none">
            <div className="text-6xl absolute top-2 left-4">🌾</div>
            <div className="text-5xl absolute top-8 right-6">🌻</div>
            <div className="text-4xl absolute bottom-4 left-8">🌾</div>
            <div className="text-5xl absolute bottom-2 right-4">🌾</div>
            <div className="text-3xl absolute top-1/2 left-2">🌻</div>
            <div className="text-3xl absolute top-1/3 right-2">🌼</div>
          </div>
        );
      case 'leao':
        // Savana
        return (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-30 pointer-events-none">
            <div className="text-6xl absolute top-4 left-6">🌴</div>
            <div className="text-5xl absolute top-2 right-8">☀️</div>
            <div className="text-4xl absolute bottom-6 left-4">🌿</div>
            <div className="text-5xl absolute bottom-2 right-6">🌴</div>
            <div className="text-3xl absolute top-1/2 left-12">🍃</div>
            <div className="text-4xl absolute top-1/3 right-4">🌿</div>
          </div>
        );
      case 'pomba':
        // Céu
        return (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-30 pointer-events-none">
            <div className="text-6xl absolute top-4 left-8">☁️</div>
            <div className="text-5xl absolute top-12 right-6">☁️</div>
            <div className="text-4xl absolute bottom-8 left-6">☁️</div>
            <div className="text-5xl absolute bottom-4 right-8">☁️</div>
            <div className="text-6xl absolute top-1/2 left-4">⭐</div>
            <div className="text-4xl absolute top-1/3 right-12">✨</div>
          </div>
        );
      default:
        return null;
    }
  }, [pet.type]);

  // Save to localStorage whenever pet state changes
  useEffect(() => {
    localStorage.setItem('checkin_pet', JSON.stringify(pet));
  }, [pet]);

  // Frutos do Espírito (Gálatas 5:22-23)
  const fruits = useMemo(() => [
    { id: 1, name: 'Maçã do Amor', emoji: '🍎', cost: 15, hunger: 30, verse: 'Amor' },
    { id: 2, name: 'Uva da Alegria', emoji: '🍇', cost: 12, hunger: 25, verse: 'Alegria' },
    { id: 3, name: 'Pêra da Paz', emoji: '🍐', cost: 10, hunger: 20, verse: 'Paz' },
    { id: 4, name: 'Pêssego da Paciência', emoji: '🍑', cost: 18, hunger: 35, verse: 'Paciência' },
    { id: 5, name: 'Mel da Amabilidade', emoji: '🍯', cost: 15, hunger: 30, verse: 'Amabilidade' },
    { id: 6, name: 'Pão da Bondade', emoji: '🍞', cost: 20, hunger: 40, verse: 'Bondade' },
  ], []);

  // Add floating text animation
  const addFloatingText = useCallback((text: string, color: string) => {
    const id = Date.now() + Math.random();
    setFloatingTexts(prev => [...prev, { id, text, color }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 2000);
  }, []);

  // Animate action (2-frame sprite animation)
  const animateAction = useCallback((type: string) => {
    setIsAnimating(true);
    setAnimationType(type);
    setTimeout(() => {
      setIsAnimating(false);
      setAnimationType(null);
    }, 1500);
  }, []);

  // Change pet type
  const changePet = useCallback((newType: string, newName: string) => {
    setPet(prev => ({
      ...prev,
      type: newType,
      name: newName
    }));
  }, []);

  // Feed pet with fruit
  const feedPet = useCallback((fruit: any) => {
    if (coins < fruit.cost) {
      addFloatingText('⭐ Insuficiente!', 'text-red-500');
      return;
    }

    // Check if hunger is already full
    if (pet.hunger >= 100) {
      addFloatingText('🍽️ Já está cheio!', 'text-orange-500');
      return;
    }

    spendCoins(fruit.cost);
    setPet(prev => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + fruit.hunger),
      lastUpdate: Date.now()
    }));

    animateAction('eating');
    addFloatingText(`-${fruit.cost} ⭐`, 'text-yellow-500');
    setTimeout(() => addFloatingText(`+${fruit.hunger} 🍽️`, 'text-green-500'), 200);
  }, [coins, pet.hunger, spendCoins, addFloatingText, animateAction]);

  // Play with pet
  const playWithPet = useCallback(() => {
    if (coins < 10) {
      addFloatingText('⭐ Insuficiente!', 'text-red-500');
      return;
    }

    if (pet.energy < 10) {
      addFloatingText('Sem energia!', 'text-orange-500');
      return;
    }

    // Check if happiness is already full
    if (pet.happiness >= 100) {
      addFloatingText('😊 Já está feliz!', 'text-pink-500');
      return;
    }

    spendCoins(10);
    setPet(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 30),
      energy: Math.max(0, prev.energy - 10),
      lastUpdate: Date.now()
    }));

    animateAction('playing');
    addFloatingText('-10 ⭐', 'text-yellow-500');
    setTimeout(() => addFloatingText('+30 😊', 'text-pink-500'), 200);
  }, [coins, pet.energy, pet.happiness, spendCoins, addFloatingText, animateAction]);

  // Pet sleep (free action)
  const petSleep = useCallback(() => {
    // Check if energy is already full
    if (pet.energy >= 100) {
      addFloatingText('⚡ Energia cheia!', 'text-blue-500');
      return;
    }

    setPet(prev => ({
      ...prev,
      energy: 100,
      lastUpdate: Date.now()
    }));

    animateAction('sleeping');
    addFloatingText('+100 ⚡', 'text-blue-500');
  }, [pet.energy, addFloatingText, animateAction]);

  // Determine pet mood
  const getPetMood = useCallback(() => {
    const avg = (pet.hunger + pet.happiness + pet.energy) / 3;
    if (avg > 70) return { emoji: '😊', mood: 'Muito Feliz!', color: 'text-green-500' };
    if (avg > 40) return { emoji: '😐', mood: 'Ok', color: 'text-yellow-600' };
    return { emoji: '😢', mood: 'Precisa de cuidados!', color: 'text-red-500' };
  }, [pet.hunger, pet.happiness, pet.energy]);

  const mood = getPetMood();

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* CAMADA 1: Céu (Fundo) */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-sky-300 to-sky-200"></div>

      {/* CAMADA 2: Nuvens (Meio) */}
      <CloudBackground />

      {/* CAMADA 3: Chão de Grama (Frente) */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-b from-green-300 to-green-600 rounded-t-[50%] shadow-[0_-15px_40px_rgba(34,197,94,0.3)] z-[5]"></div>

      {/* Content */}
      <div className="relative z-10 h-full overflow-y-auto pb-24 pt-16 px-4 custom-scrollbar">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
            Lar do Amiguinho
          </h1>
          <p className="text-sm font-bold text-gray-600 mt-1">
            Use suas Estrelas da Virtude! ⭐
          </p>
        </div>

        {/* Pet Display com Habitat */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-xl border-2 border-pink-200 relative overflow-hidden">
          {/* Decoração de Habitat Natural */}
          {getHabitatDecoration()}

          {/* Botão de Trocar Pet */}
          <button
            onClick={() => setShowPetSelector(true)}
            className="absolute top-3 right-3 bg-gradient-to-b from-purple-400 to-purple-600 text-white p-2 rounded-full shadow-lg border-b-4 border-purple-700 hover:scale-110 active:border-b-0 active:translate-y-1 transition-all z-30"
            title="Trocar amiguinho"
          >
            <Repeat2 size={20} strokeWidth={3} />
          </button>
          {/* Floating texts */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
            {floatingTexts.map((ft, index) => (
              <div
                key={ft.id}
                className={`absolute font-black text-2xl ${ft.color}`}
                style={{
                  animation: 'floatUp 2s ease-out forwards',
                  left: `${(index % 3 - 1) * 30}px`
                }}
              >
                {ft.text}
              </div>
            ))}
          </div>

          {/* Pet */}
          <div className="text-center mb-4 relative">
            <div
              className={`text-8xl mb-2 relative z-10 ${isAnimating ? '' : 'animate-bounce'}`}
              style={{
                animation: isAnimating ? 'petBounce 0.3s ease-in-out infinite' : undefined
              }}
            >
              {(() => {
                const currentPetType = petTypes.find(p => p.type === pet.type);
                if (!currentPetType) return '🐑';

                // Sprite animation: alternate between main and alt emoji
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
            {/* Sombra oval embaixo do pet */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-32 h-4 bg-black/20 rounded-full blur-md"></div>

            <div className="text-4xl mb-1">{mood.emoji}</div>
            <p className="font-bold text-gray-700 text-lg">{pet.name}</p>
            <p className={`text-sm font-bold ${mood.color}`}>{mood.mood}</p>
          </div>

          {/* Status Bars - HUD 3D Vibrante */}
          <div className="space-y-3">
            {/* Hunger */}
            <div className="bg-white/50 backdrop-blur-md rounded-full p-3 border-2 border-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-br from-orange-400 to-red-500 p-2 rounded-full shadow-md">
                  <span className="text-white text-sm">🍽️</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-orange-600">Fome</span>
                    <span className="text-orange-500">{pet.hunger}%</span>
                  </div>
                  <div className="h-4 bg-orange-100 rounded-full overflow-hidden border border-orange-200">
                    <div
                      className="h-full bg-gradient-to-r from-orange-300 to-orange-500 transition-all duration-500 shadow-inner"
                      style={{ width: `${pet.hunger}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Happiness */}
            <div className="bg-white/50 backdrop-blur-md rounded-full p-3 border-2 border-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-br from-yellow-400 to-pink-500 p-2 rounded-full shadow-md">
                  <span className="text-white text-sm">😊</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-yellow-600">Alegria</span>
                    <span className="text-yellow-500">{pet.happiness}%</span>
                  </div>
                  <div className="h-4 bg-yellow-100 rounded-full overflow-hidden border border-yellow-200">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-300 to-yellow-500 transition-all duration-500 shadow-inner"
                      style={{ width: `${pet.happiness}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Energy */}
            <div className="bg-white/50 backdrop-blur-md rounded-full p-3 border-2 border-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-br from-blue-400 to-cyan-500 p-2 rounded-full shadow-md">
                  <span className="text-white text-sm">⚡</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-blue-600">Energia</span>
                    <span className="text-blue-500">{pet.energy}%</span>
                  </div>
                  <div className="h-4 bg-blue-100 rounded-full overflow-hidden border border-blue-200">
                    <div
                      className="h-full bg-gradient-to-r from-blue-300 to-blue-500 transition-all duration-500 shadow-inner"
                      style={{ width: `${pet.energy}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Frutos do Espírito Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-black text-lg text-gray-700">🍎 Frutos do Espírito</h2>
            <p className="text-[10px] text-gray-500 font-bold">Gálatas 5:22</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {fruits.map(fruit => (
              <button
                key={fruit.id}
                onClick={() => feedPet(fruit)}
                disabled={coins < fruit.cost}
                className={`bg-gradient-to-b from-white to-green-50 backdrop-blur-sm rounded-3xl p-4 shadow-lg border-b-4 transition-all ${
                  coins < fruit.cost
                    ? 'opacity-50 cursor-not-allowed border-gray-300'
                    : 'border-green-400 hover:scale-105 hover:shadow-[0_8px_30px_rgba(34,197,94,0.3)] active:border-b-0 active:translate-y-1'
                }`}
              >
                <div className="text-4xl mb-2">{fruit.emoji}</div>
                <p className="font-bold text-xs text-gray-700 mb-1">{fruit.name}</p>
                <div className="flex items-center justify-center gap-1 text-xs mb-1">
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{fruit.cost}</span>
                </div>
                <p className="text-[10px] text-green-600 font-bold">+{fruit.hunger} Fome</p>
              </button>
            ))}
          </div>
        </div>

        {/* Activities Section */}
        <div className="mb-6">
          <h2 className="font-black text-lg text-gray-700 mb-3">🎯 Atividades</h2>
          <div className="grid grid-cols-2 gap-3">
            {/* Play */}
            <button
              onClick={playWithPet}
              disabled={coins < 10 || pet.energy < 10}
              className={`bg-gradient-to-b from-white to-pink-50 backdrop-blur-sm rounded-3xl p-4 shadow-lg border-b-4 transition-all ${
                coins < 10 || pet.energy < 10
                  ? 'opacity-50 cursor-not-allowed border-gray-300'
                  : 'border-pink-400 hover:scale-105 hover:shadow-[0_8px_30px_rgba(244,114,182,0.3)] active:border-b-0 active:translate-y-1'
              }`}
            >
              <div className="text-4xl mb-2">🎾</div>
              <p className="font-bold text-xs text-gray-700 mb-1">Brincar</p>
              <div className="flex items-center justify-center gap-1 text-xs mb-1">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                <span className="font-bold">10</span>
              </div>
              <p className="text-[10px] text-pink-600 font-bold">+30 Alegria | -10 Energia</p>
            </button>

            {/* Sleep */}
            <button
              onClick={petSleep}
              disabled={pet.energy === 100}
              className={`bg-gradient-to-b from-white to-blue-50 backdrop-blur-sm rounded-3xl p-4 shadow-lg border-b-4 transition-all ${
                pet.energy === 100
                  ? 'opacity-50 cursor-not-allowed border-gray-300'
                  : 'border-blue-400 hover:scale-105 hover:shadow-[0_8px_30px_rgba(59,130,246,0.3)] active:border-b-0 active:translate-y-1'
              }`}
            >
              <div className="text-4xl mb-2">😴</div>
              <p className="font-bold text-xs text-gray-700 mb-1">Dormir</p>
              <div className="flex items-center justify-center gap-1 text-xs mb-1">
                <span className="font-bold text-green-600">Grátis!</span>
              </div>
              <p className="text-[10px] text-blue-600 font-bold">Restaura Energia</p>
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 border-2 border-purple-200">
          <p className="text-xs text-gray-700 text-center font-medium leading-relaxed">
            💡 <strong>Dica Espiritual:</strong> Pratique as virtudes nos jogos para ganhar Estrelas e cultivar os Frutos do Espírito no seu amiguinho!
          </p>
        </div>
      </div>

      {/* Modal de Seleção de Pet */}
      {showPetSelector && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300"
          onClick={() => setShowPetSelector(false)}
        >
          <div
            className="bg-gradient-to-b from-white to-purple-50 rounded-3xl p-8 text-center shadow-[0_0_80px_rgba(168,85,247,0.8)] border-4 border-purple-400 max-w-sm w-full relative animate-in zoom-in duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sparkles */}
            <div className="absolute -top-4 -left-4 text-purple-400 animate-pulse">
              <Sparkles size={32} fill="currentColor" />
            </div>
            <div className="absolute -top-4 -right-4 text-pink-400 animate-pulse" style={{ animationDelay: '0.3s' }}>
              <Sparkles size={28} fill="currentColor" />
            </div>

            {/* Header */}
            <div className="mb-6">
              <Repeat2 size={48} className="mx-auto mb-3 text-purple-600" strokeWidth={2.5} />
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500">
                Trocar Amiguinho
              </h2>
              <p className="text-sm font-bold text-gray-600 mt-2">Escolha seu companheiro espiritual:</p>
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
                  className={`p-4 rounded-3xl border-b-4 transition-all ${
                    pet.type === petOption.type
                      ? 'bg-gradient-to-br from-purple-300 to-pink-300 border-purple-600 scale-110 shadow-[0_8px_30px_rgba(168,85,247,0.5)]'
                      : 'bg-gradient-to-b from-white to-gray-50 border-gray-300 hover:scale-110 hover:shadow-lg active:border-b-0 active:translate-y-1'
                  }`}
                >
                  <div className="text-5xl mb-2">{petOption.emoji}</div>
                  <p className="text-xs font-black text-gray-700">{petOption.name}</p>
                </button>
              ))}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowPetSelector(false)}
              className="w-full bg-gradient-to-r from-gray-400 to-gray-600 text-white font-black text-sm py-3 rounded-2xl shadow-lg border-b-4 border-gray-700 hover:scale-105 active:border-b-0 active:translate-y-1 transition-all"
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
