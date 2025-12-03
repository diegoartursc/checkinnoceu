import React, { memo, useState, useMemo, useCallback } from 'react';
import { Repeat2, Star } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { PETS } from '../../data/pets';
import HabitatPasto from '../../screens/habitats/HabitatPasto';
import HabitatNuvem from '../../screens/habitats/HabitatNuvem';
import HabitatArvore from '../../screens/habitats/HabitatArvore';
import HabitatLago from '../../screens/habitats/HabitatLago';
import HabitatColina from '../../screens/habitats/HabitatColina';

const LarScreen = memo(({ onOpenEveningPrayer, onOpenMonthlyLetter }) => {
  const { pet, setPetType, feedPet, playWithPet, restPet, coins } = useAppState();

  // Floating feedback texts
  const [floatingTexts, setFloatingTexts] = useState([]);

  // Pet animation states
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationType, setAnimationType] = useState(null);

  // Pet selector modal
  const [showPetSelector, setShowPetSelector] = useState(false);

  // Frutos do Espírito (Gálatas 5:22-23)
  const fruits = useMemo(() => [
    { id: 1, name: 'Maçã do Amor', emoji: '🍎', cost: 15, hunger: 30 },
    { id: 2, name: 'Uva da Alegria', emoji: '🍇', cost: 12, hunger: 25 },
    { id: 3, name: 'Pêra da Paz', emoji: '🍐', cost: 10, hunger: 20 },
  ], []);

  // Add floating text animation
  const addFloatingText = useCallback((text, color) => {
    const id = Date.now() + Math.random();
    setFloatingTexts(prev => [...prev, { id, text, color }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 2000);
  }, []);

  // Animate action
  const animateAction = useCallback((type) => {
    setIsAnimating(true);
    setAnimationType(type);
    setTimeout(() => {
      setIsAnimating(false);
      setAnimationType(null);
    }, 1500);
  }, []);

  // Handle Feeding
  const handleFeed = useCallback((fruit) => {
    if (coins < fruit.cost) {
      addFloatingText('⭐ Insuficiente!', 'text-red-500');
      return;
    }
    if (pet.hunger >= 100) {
      addFloatingText('🍽️ Já está cheio!', 'text-orange-500');
      return;
    }

    const success = feedPet(fruit.hunger, fruit.cost);
    if (success) {
      animateAction('eating');
      addFloatingText(`-${fruit.cost} ⭐`, 'text-yellow-500');
      setTimeout(() => addFloatingText(`+${fruit.hunger} 🍽️`, 'text-green-500'), 200);
    }
  }, [coins, pet.hunger, feedPet, addFloatingText, animateAction]);

  // Handle Playing
  const handlePlay = useCallback(() => {
    if (coins < 10) {
      addFloatingText('⭐ Insuficiente!', 'text-red-500');
      return;
    }
    if (pet.energy < 10) {
      addFloatingText('Sem energia!', 'text-orange-500');
      return;
    }
    if (pet.happiness >= 100) {
      addFloatingText('😊 Já está feliz!', 'text-pink-500');
      return;
    }

    const success = playWithPet();
    if (success) {
      animateAction('playing');
      addFloatingText('-10 ⭐', 'text-yellow-500');
      setTimeout(() => addFloatingText('+30 😊', 'text-pink-500'), 200);
    }
  }, [coins, pet.energy, pet.happiness, playWithPet, addFloatingText, animateAction]);

  // Handle Sleep
  const handleSleep = useCallback(() => {
    if (pet.energy >= 100) {
      addFloatingText('⚡ Energia cheia!', 'text-blue-500');
      return;
    }
    restPet();
    animateAction('sleeping');
    addFloatingText('+100 ⚡', 'text-blue-500');
  }, [pet.energy, restPet, addFloatingText, animateAction]);

  // Change pet type
  const handleChangePet = useCallback((newType) => {
    setPetType(newType);
    setShowPetSelector(false);
  }, [setPetType]);

  // Determine pet mood
  const mood = useMemo(() => {
    const { hunger, happiness, energy } = pet;
    const avg = (hunger + happiness + energy) / 3;

    if (energy < 20) return { emoji: '😴', mood: 'Muito Cansado', color: 'text-blue-600' };
    if (hunger < 20) return { emoji: '😫', mood: 'Com Fome!', color: 'text-orange-600' };
    if (happiness < 20) return { emoji: '😢', mood: 'Triste', color: 'text-gray-600' };

    const lowStats = [hunger < 40, happiness < 40, energy < 40].filter(Boolean).length;
    if (lowStats >= 2) return { emoji: '😠', mood: 'Chateado', color: 'text-red-600' };

    if (avg > 80) return { emoji: '😊', mood: 'Muito Feliz!', color: 'text-green-500' };
    if (avg > 60) return { emoji: '😌', mood: 'Contente', color: 'text-green-600' };
    if (avg > 40) return { emoji: '😐', mood: 'Normal', color: 'text-yellow-600' };

    return { emoji: '😟', mood: 'Precisa de Carinho', color: 'text-orange-500' };
  }, [pet]);

  // Resolve Habitat Component
  const Habitat = useMemo(() => {
    const petData = PETS[pet.type];
    const habitatName = petData ? petData.habitat : 'pasto';

    switch (habitatName) {
      case 'pasto': return HabitatPasto;
      case 'nuvem': return HabitatNuvem;
      case 'arvore': return HabitatArvore;
      case 'lago': return HabitatLago;
      case 'colina': return HabitatColina;
      default: return HabitatPasto;
    }
  }, [pet.type]);

  const currentPetData = PETS[pet.type] || PETS.cordeirinho;

  return (
    <Habitat>
      <div className="flex flex-col h-full overflow-y-auto pb-24 pt-16 px-4 custom-scrollbar relative z-20">

        {/* Header - Minimalista */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-green-800">
            Lar do Amiguinho
          </h1>
          <p className="text-xs text-green-600 mt-1">
            Um cantinho de paz e cuidado 🌿
          </p>
        </div>

        {/* Pet Display */}
        <div className="relative mb-6">
          {/* Botão de Trocar Pet */}
          <button
            onClick={() => setShowPetSelector(true)}
            className="absolute top-2 right-2 w-9 h-9 bg-white/80 backdrop-blur-sm text-green-600 rounded-full shadow-sm border border-gray-100 hover:shadow-md hover:scale-105 active:scale-95 transition-all z-30"
            title="Trocar amiguinho"
          >
            <Repeat2 size={16} strokeWidth={2} className="mx-auto" />
          </button>

          {/* Floating texts */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 w-full h-full">
            {floatingTexts.map((ft, index) => (
              <div
                key={ft.id}
                className={`absolute font-black text-2xl ${ft.color} drop-shadow-lg left-1/2`}
                style={{
                  animation: 'floatUp 2s ease-out forwards',
                  marginLeft: `${(index % 3 - 1) * 30}px`,
                  marginTop: '-50px'
                }}
              >
                {ft.text}
              </div>
            ))}
          </div>

          {/* Pet Animation Wrapper */}
          <div className="text-center relative py-16">
            <div
              className={`text-9xl relative z-10 inline-block cursor-pointer select-none ${!isAnimating && 'animate-[bounce_4s_ease-in-out_infinite]'}`}
              style={{
                animation: isAnimating ? 'petBounce 0.3s ease-in-out infinite' : undefined
              }}
              onClick={() => {
                 // Simple tap interaction
                 addFloatingText('❤️', 'text-pink-500');
              }}
            >
              {isAnimating && animationType === 'sleeping' ? '😴' : currentPetData.emoji}
            </div>

            {/* Shadow */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-black/20 rounded-full blur-lg"></div>

            {/* Name and Mood */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className="text-4xl">{mood.emoji}</span>
              <div className="bg-white/60 backdrop-blur-sm px-4 py-1 rounded-full shadow-sm">
                <p className="font-bold text-sm text-gray-800">{currentPetData.name}</p>
              </div>
            </div>
          </div>

          {/* Status Bars */}
          <div className="flex justify-center items-center gap-2 px-4 mt-4">
            {/* Hunger */}
            <div className="bg-white/60 backdrop-blur-sm rounded-full px-3 py-2 shadow-sm flex items-center gap-1.5">
              <span className="text-sm">🍽️</span>
              <div className="w-12 h-1 bg-orange-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-400 transition-all duration-500" style={{ width: `${pet.hunger}%` }} />
              </div>
            </div>

            {/* Happiness */}
            <div className="bg-white/60 backdrop-blur-sm rounded-full px-3 py-2 shadow-sm flex items-center gap-1.5">
              <span className="text-sm">❤️</span>
              <div className="w-12 h-1 bg-pink-200 rounded-full overflow-hidden">
                <div className="h-full bg-pink-400 transition-all duration-500" style={{ width: `${pet.happiness}%` }} />
              </div>
            </div>

            {/* Energy */}
            <div className="bg-white/60 backdrop-blur-sm rounded-full px-3 py-2 shadow-sm flex items-center gap-1.5">
              <span className="text-sm">⚡</span>
              <div className="w-12 h-1 bg-blue-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 transition-all duration-500" style={{ width: `${pet.energy}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Actions Panel */}
        <div className="mt-8 px-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Feed Button (First available fruit) */}
            <button
              onClick={() => handleFeed(fruits[0])}
              disabled={coins < fruits[0].cost}
              className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-all ${
                coins < fruits[0].cost ? 'opacity-40 cursor-not-allowed' : 'hover:shadow-md hover:-translate-y-1 active:scale-95'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="text-4xl">{fruits[0].emoji}</div>
                <p className="font-bold text-xs text-gray-700">COMER</p>
                <div className="bg-yellow-100 rounded-full px-2 py-0.5 flex items-center gap-1">
                  <Star size={10} className="fill-yellow-500 text-yellow-500" />
                  <span className="font-bold text-yellow-700 text-[10px]">{fruits[0].cost}</span>
                </div>
              </div>
            </button>

            {/* Play Button */}
            <button
              onClick={handlePlay}
              disabled={coins < 10 || pet.energy < 10}
              className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-all ${
                coins < 10 || pet.energy < 10 ? 'opacity-40 cursor-not-allowed' : 'hover:shadow-md hover:-translate-y-1 active:scale-95'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="text-4xl">🎮</div>
                <p className="font-bold text-xs text-gray-700">BRINCAR</p>
                <div className="bg-pink-100 rounded-full px-2 py-0.5 flex items-center gap-1">
                  <Star size={10} className="fill-pink-500 text-pink-500" />
                  <span className="font-bold text-pink-700 text-[10px]">10</span>
                </div>
              </div>
            </button>

            {/* Sleep Button */}
            <button
              onClick={handleSleep}
              disabled={pet.energy === 100}
              className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-all ${
                pet.energy === 100 ? 'opacity-40 cursor-not-allowed' : 'hover:shadow-md hover:-translate-y-1 active:scale-95'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="text-4xl">🌙</div>
                <p className="font-bold text-xs text-gray-700">DORMIR</p>
                <div className="bg-blue-100 rounded-full px-2 py-0.5">
                  <span className="font-bold text-blue-700 text-[10px]">0 ★</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Extra Actions */}
        <div className="mt-8 mb-6 px-4">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={onOpenEveningPrayer} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="text-2xl mb-1">🙏</div>
              <p className="font-bold text-[10px] text-gray-600">Oração da Noite</p>
            </button>
            <button onClick={onOpenMonthlyLetter} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="text-2xl mb-1">💌</div>
              <p className="font-bold text-[10px] text-gray-600">Cartinha Mensal</p>
            </button>
          </div>
        </div>
      </div>

      {/* Pet Selector Modal */}
      {showPetSelector && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
          onClick={() => setShowPetSelector(false)}
        >
          <div
            className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full relative animate-in zoom-in duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6">
              <Repeat2 size={36} className="mx-auto mb-3 text-green-600" strokeWidth={2} />
              <h2 className="text-2xl font-bold text-gray-800">Trocar Amiguinho</h2>
            </div>

            <div className="flex gap-4 justify-center mb-6 flex-wrap">
              {Object.values(PETS).filter(p => !p.locked).map(petOption => (
                <button
                  key={petOption.id}
                  onClick={() => handleChangePet(petOption.id)}
                  className={`p-4 rounded-2xl border transition-all ${
                    pet.type === petOption.id
                      ? 'bg-green-100 border-green-400 scale-105 shadow-lg'
                      : 'bg-gray-50 border-gray-200 hover:scale-105'
                  }`}
                >
                  <div className="text-5xl mb-2">{petOption.emoji}</div>
                  <p className="text-xs font-bold text-gray-700">{petOption.name.split(' ')[0]}</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowPetSelector(false)}
              className="w-full bg-gray-100 text-gray-700 font-bold text-sm py-3 rounded-2xl border border-gray-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </Habitat>
  );
});

LarScreen.displayName = 'LarScreen';

export default LarScreen;
