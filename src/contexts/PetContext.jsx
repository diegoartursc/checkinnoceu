import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getPetState, setPetState } from '../services/storage';

const PetContext = createContext();

export const usePet = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePet must be used within PetProvider');
  }
  return context;
};

export const PetProvider = ({ children }) => {
  const [pet, setPet] = useState(() => getPetState());

  // Calculate decay based on time passed
  const applyDecay = useCallback(() => {
    const now = Date.now();
    const lastUpdate = pet.lastUpdate || now;
    const hoursPassed = (now - lastUpdate) / (1000 * 60 * 60);

    if (hoursPassed > 0.01) { // Only update if at least ~36 seconds passed
      const newPet = {
        ...pet,
        hunger: Math.max(0, pet.hunger - Math.floor(hoursPassed * 5)),
        happiness: Math.max(0, pet.happiness - Math.floor(hoursPassed * 3)),
        energy: Math.max(0, pet.energy - Math.floor(hoursPassed * 4)),
        lastUpdate: now
      };
      setPetState(newPet);
      setPet(newPet);
    }
  }, [pet]);

  // Apply decay on mount
  useEffect(() => {
    applyDecay();
  }, []);

  const feedPet = useCallback((fruit) => {
    const newPet = {
      ...pet,
      hunger: Math.min(100, pet.hunger + 20),
      happiness: Math.min(100, pet.happiness + 10),
      lastUpdate: Date.now()
    };
    setPetState(newPet);
    setPet(newPet);
  }, [pet]);

  const playWithPet = useCallback(() => {
    const newPet = {
      ...pet,
      happiness: Math.min(100, pet.happiness + 20),
      energy: Math.max(0, pet.energy - 10),
      lastUpdate: Date.now()
    };
    setPetState(newPet);
    setPet(newPet);
  }, [pet]);

  const letPetSleep = useCallback(() => {
    const newPet = {
      ...pet,
      energy: Math.min(100, pet.energy + 30),
      happiness: Math.min(100, pet.happiness + 5),
      lastUpdate: Date.now()
    };
    setPetState(newPet);
    setPet(newPet);
  }, [pet]);

  const changePetType = useCallback((type) => {
    const newPet = {
      ...pet,
      type,
      lastUpdate: Date.now()
    };
    setPetState(newPet);
    setPet(newPet);
  }, [pet]);

  const getPetMood = useCallback(() => {
    const avg = (pet.hunger + pet.happiness + pet.energy) / 3;
    if (avg >= 70) return 'happy';
    if (avg >= 40) return 'neutral';
    return 'sad';
  }, [pet]);

  return (
    <PetContext.Provider
      value={{
        pet,
        feedPet,
        playWithPet,
        letPetSleep,
        changePetType,
        getPetMood,
        applyDecay
      }}
    >
      {children}
    </PetContext.Provider>
  );
};
