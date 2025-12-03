import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
    getCoins, setCoins as saveCoins,
    getLastCompletedDay, setLastCompletedDay as saveLastCompletedDay,
    getStreak, setStreak as saveStreak,
    getLastDate, setLastDate as saveLastDate,
    getPetState, setPetState as savePetState,
    getCompletedDays, setCompletedDays as saveCompletedDays,
    getDevotionalComplete, setDevotionalComplete as saveDevotionalComplete,
    getDevotionalDate, setDevotionalDate as saveDevotionalDate,
    getDevotionalStatus, setDevotionalStatus as saveDevotionalStatus
} from '../services/storage';
import { PETS } from '../data/pets';

const AppStateContext = createContext();

export const useAppState = () => {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error('useAppState must be used within AppStateProvider');
    }
    return context;
};

export const AppStateProvider = ({ children }) => {
    // --- STATE INITIALIZATION ---
    const [coins, setCoins] = useState(() => getCoins());
    const [lastCompletedDay, setLastCompletedDay] = useState(() => getLastCompletedDay());
    const [streak, setStreak] = useState(() => getStreak());
    const [lastDate, setLastDate] = useState(() => getLastDate());
    const [pet, setPet] = useState(() => getPetState());
    const [completedDays, setCompletedDays] = useState(() => getCompletedDays());

    // Legacy devotional complete (for backward compatibility / full flow completion)
    const [devotionalComplete, setDevotionalComplete] = useState(() => {
        const today = new Date().toDateString();
        const savedDate = getDevotionalDate();
        return savedDate === today && getDevotionalComplete();
    });

    // Granular devotional status
    const [devotionalStatus, setDevotionalStatus] = useState(() => {
        const status = getDevotionalStatus();
        const today = new Date().toDateString();
        const savedDate = new Date(status.lastUpdated).toDateString();

        // If it's a new day, reset daily flags but keep persistent data if needed
        if (savedDate !== today) {
            return {
                ...status,
                morningPrayerDone: false,
                gratitudeDone: false,
                goodActionChosen: status.goodActionChosen, // Keep chosen action? Or reset? Usually reset daily.
                goodActionCompleted: false,
                nightPrayerDone: false,
                lastUpdated: Date.now()
            };
        }
        return status;
    });

    // --- EFFECTS ---

    // Initial persistence check & Daily Reset Logic
    useEffect(() => {
        const today = new Date().toDateString();
        const savedDate = getDevotionalDate();

        // Reset legacy devotionalComplete if new day
        if (savedDate !== today) {
            setDevotionalComplete(false);
            saveDevotionalComplete(false);
        }

        // Pet Data Validation/Cleanup
        if (!PETS[pet.type]) {
            setPet(prev => {
                 const newPet = {
                     ...prev,
                     type: 'cordeirinho',
                     name: PETS.cordeirinho.name
                 };
                 savePetState(newPet);
                 return newPet;
            });
        }

        // Pet Decay Logic (Time-based)
        const now = Date.now();
        const lastUpdate = pet.lastUpdate || now;
        const hoursPassed = (now - lastUpdate) / (1000 * 60 * 60);

        if (hoursPassed > 0.5) { // Update every 30 mins roughly
             const hungerDecay = Math.floor(hoursPassed * 2); // 2 per hour
             const happinessDecay = Math.floor(hoursPassed * 1); // 1 per hour
             const energyDecay = Math.floor(hoursPassed * 1.5); // 1.5 per hour

             setPet(prev => {
                 const newPet = {
                     ...prev,
                     hunger: Math.max(0, prev.hunger - hungerDecay),
                     happiness: Math.max(0, prev.happiness - happinessDecay),
                     energy: Math.max(0, prev.energy - energyDecay),
                     lastUpdate: now
                 };
                 savePetState(newPet);
                 return newPet;
             });
        }

        // Check "Saudade" (Missed Morning Prayer Logic)
        // Use lastMorningPrayerTimestamp from devotionalStatus if available, else fallback to lastUpdated (if morningPrayerDone was true previously)
        // Ideally we track lastMorningPrayerTime. For now, let's look at devotionalStatus.lastMorningPrayerTime if we add it.
        // Or we use the property we will add now.

        const lastPrayerTime = devotionalStatus.lastMorningPrayerTime || (devotionalStatus.morningPrayerDone ? devotionalStatus.lastUpdated : 0);

        if (lastPrayerTime) {
            const diffTime = now - lastPrayerTime;
            const diffDays = diffTime / (1000 * 60 * 60 * 24);

            if (diffDays >= 2) {
                 // Decrease happiness for missing 2+ days
                 setPet(prev => {
                     const newPet = {
                         ...prev,
                         happiness: Math.max(0, prev.happiness - 3)
                     };
                     savePetState(newPet);
                     return newPet;
                 });
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Persist Devotional Status whenever it changes
    useEffect(() => {
        saveDevotionalStatus(devotionalStatus);
    }, [devotionalStatus]);

    // --- ACTIONS ---

    // Coin Management
    const addCoins = useCallback((amount) => {
        setCoins(prev => {
            const newValue = prev + amount;
            saveCoins(newValue);
            return newValue;
        });
    }, []);

    const spendCoins = useCallback((amount) => {
        setCoins(prev => {
            if (prev < amount) return prev;
            const newValue = prev - amount;
            saveCoins(newValue);
            return newValue;
        });
    }, []);

    // Progress Management
    const completeDay = useCallback((dayIndex, stars = 3) => {
        if (dayIndex > lastCompletedDay) {
            setLastCompletedDay(dayIndex);
            saveLastCompletedDay(dayIndex);
        }

        setCompletedDays(prev => {
            const newState = { ...prev, [dayIndex]: stars };
            saveCompletedDays(newState);
            return newState;
        });

        // Streak Logic
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        if (lastDate === yesterday) {
            const newStreak = streak + 1;
            setStreak(newStreak);
            saveStreak(newStreak);
        } else if (lastDate !== today) {
             setStreak(1);
             saveStreak(1);
        }

        if (lastDate !== today) {
            setLastDate(today);
            saveLastDate(today);
        }
    }, [lastCompletedDay, lastDate, streak]);

    // Pet Management
    const updatePet = useCallback((newPetState) => {
        setPet(prev => {
            const merged = { ...prev, ...newPetState, lastUpdate: Date.now() };
            savePetState(merged);
            return merged;
        });
    }, []);

    const setPetType = useCallback((type) => {
        if (PETS[type]) {
            // If changing type, we might want to reset stats or keep them?
            // Usually keeping stats is nicer, but resetting ensures valid state.
            // Let's keep stats but ensure name matches if not custom.
            updatePet({ type, name: PETS[type].name });
        }
    }, [updatePet]);

    const feedPet = useCallback((amount = 10, cost = 0) => {
        if (coins >= cost) {
            if (cost > 0) spendCoins(cost);
            updatePet({
                hunger: Math.min(100, pet.hunger + amount)
            });
            return true;
        }
        return false;
    }, [coins, pet.hunger, spendCoins, updatePet]);

    const playWithPet = useCallback(() => {
        if (pet.energy >= 10 && coins >= 10) {
            spendCoins(10);
            updatePet({
                happiness: Math.min(100, pet.happiness + 30),
                energy: Math.max(0, pet.energy - 10)
            });
            return true;
        }
        return false;
    }, [coins, pet.energy, pet.happiness, spendCoins, updatePet]);

    const restPet = useCallback(() => {
        updatePet({
            energy: 100
        });
    }, [updatePet]);

    // Devotional Logic
    const updateDevotionalStatus = useCallback((updates) => {
        setDevotionalStatus(prev => {
            const newState = { ...prev, ...updates, lastUpdated: Date.now() };
            return newState;
        });
    }, []);

    const markMorningPrayerDone = useCallback(() => {
        updateDevotionalStatus({
            morningPrayerDone: true,
            lastMorningPrayerTime: Date.now()
        });
        // Check 2 days logic is handled on load, but we could boost happiness here
        updatePet({ happiness: Math.min(100, pet.happiness + 5) });
    }, [updateDevotionalStatus, updatePet, pet.happiness]);

    const markGratitudeDone = useCallback(() => {
        updateDevotionalStatus({ gratitudeDone: true });
    }, [updateDevotionalStatus]);

    const setGoodActionChoice = useCallback((choice) => {
        updateDevotionalStatus({ goodActionChosen: choice });
    }, [updateDevotionalStatus]);

    const markGoodActionCompleted = useCallback(() => {
        if (!devotionalStatus.goodActionCompleted) {
            updateDevotionalStatus({ goodActionCompleted: true });
            // Bonus happiness
            updatePet({ happiness: Math.min(100, pet.happiness + 5) });
        }
    }, [devotionalStatus.goodActionCompleted, updateDevotionalStatus, updatePet, pet.happiness]);

    const markNightPrayerDone = useCallback(() => {
        updateDevotionalStatus({ nightPrayerDone: true });
    }, [updateDevotionalStatus]);

    // Legacy support for "completing the whole flow"
    const completeDevotional = useCallback(() => {
        const today = new Date().toDateString();
        setDevotionalComplete(true);
        saveDevotionalComplete(true);
        saveDevotionalDate(today);
        addCoins(10);
        updatePet({
            happiness: Math.min(100, pet.happiness + 20)
        });
    }, [addCoins, pet.happiness, updatePet]);

    const value = {
        // Economy & Progress
        coins,
        addCoins,
        spendCoins,
        lastCompletedDay,
        completeDay,
        streak,
        completedDays,

        // Pet
        pet,
        setPetType,
        feedPet,
        playWithPet,
        restPet,
        updatePet, // Low level update if needed

        // Devotional (Granular)
        devotionalStatus,
        markMorningPrayerDone,
        markGratitudeDone,
        setGoodActionChoice,
        markGoodActionCompleted,
        markNightPrayerDone,

        // Devotional (Legacy/Global)
        devotionalComplete,
        completeDevotional
    };

    return (
        <AppStateContext.Provider value={value}>
            {children}
        </AppStateContext.Provider>
    );
};

export default AppStateProvider;
