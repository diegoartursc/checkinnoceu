import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { PET_TYPES } from '../../constants/pets';
import { Check } from 'lucide-react';
import CloudBackground from '../../components/ui/CloudBackground';

const ChooseMascotScreen = ({ onNext }) => {
  const { updatePet } = useUser();
  const [selectedPetId, setSelectedPetId] = useState(null);

  // Filter only for the onboarding pets
  const onboardingPets = PET_TYPES.filter(p => ['ovelhinha', 'anjinho'].includes(p.type));

  const handleSelect = (pet) => {
    setSelectedPetId(pet.type);
  };

  const handleConfirm = () => {
    if (!selectedPetId) return;

    const chosenPet = PET_TYPES.find(p => p.type === selectedPetId);

    // Update global pet state
    updatePet({
      type: chosenPet.type,
      name: chosenPet.displayName || chosenPet.name, // Use display name if available
      happiness: 70,
      hunger: 80, // High hunger value means full stomach (Good)
      energy: 80,
      lastUpdate: Date.now()
    });

    onNext();
  };

  return (
    <div className="relative h-full flex flex-col items-center p-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-100 via-sky-100 to-white z-0">
         <CloudBackground />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col h-full">
        <div className="mt-8 mb-6 text-center">
          <h1 className="text-2xl font-bold text-sky-800 mb-2">Quem vai caminhar com você?</h1>
          <p className="text-sky-600">Escolha seu companheiro de jornada</p>
        </div>

        <div className="flex-1 flex flex-col gap-4 justify-center">
          {onboardingPets.map(pet => {
            const isSelected = selectedPetId === pet.type;
            return (
              <button
                key={pet.type}
                onClick={() => handleSelect(pet)}
                className={`relative group bg-white rounded-3xl p-6 transition-all duration-300 border-2 text-left ${
                  isSelected
                    ? 'border-sky-500 shadow-xl scale-105 ring-4 ring-sky-200'
                    : 'border-white shadow-md hover:shadow-lg hover:scale-[1.02] opacity-90'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`text-6xl p-4 bg-gray-50 rounded-2xl ${isSelected ? 'animate-bounce' : ''}`}>
                    {pet.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-800 mb-1">
                      {pet.displayName || pet.name}
                    </h3>
                    <p className="text-sm text-gray-600 whitespace-pre-line leading-tight">
                      {pet.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-4 right-4 bg-sky-500 text-white rounded-full p-1 shadow-sm animate-in zoom-in">
                      <Check size={20} strokeWidth={3} />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 mb-8">
          <button
            onClick={handleConfirm}
            disabled={!selectedPetId}
            className={`w-full font-bold text-xl py-4 rounded-2xl shadow-lg transform transition-all border-b-4 ${
              selectedPetId
                ? 'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white border-green-600 hover:scale-105 active:scale-95 active:border-b-0 active:translate-y-1'
                : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
            }`}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChooseMascotScreen;
