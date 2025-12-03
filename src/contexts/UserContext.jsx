import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
    getCoins, setCoins as saveCoins,
    getLastCompletedDay, setLastCompletedDay as saveLastCompletedDay,
    getStreak, setStreak as saveStreak,
    getLastDate, setLastDate as saveLastDate,
    getPetState, setPetState as savePetState,
    getCompletedDays, setCompletedDays as saveCompletedDays,
    getDevotionalComplete, setDevotionalComplete as saveDevotionalComplete,
    getDevotionalDate, setDevotionalDate as saveDevotionalDate
} from '../services/storage';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [coins, setCoins] = useState(() => getCoins());
    const [lastCompletedDay, setLastCompletedDay] = useState(() => getLastCompletedDay());
    const [streak, setStreak] = useState(() => getStreak());
    const [lastDate, setLastDate] = useState(() => getLastDate());
    const [pet, setPet] = useState(() => getPetState());
    const [completedDays, setCompletedDays] = useState(() => getCompletedDays());
    const [devotionalComplete, setDevotionalComplete] = useState(() => {
        const today = new Date().toDateString();
        const savedDate = getDevotionalDate();
        return savedDate === today && getDevotionalComplete();
    });

    // Initial persistence check
    useEffect(() => {
         const today = new Date().toDateString();
         const savedDate = getDevotionalDate();
         if (savedDate !== today) {
             setDevotionalComplete(false);
             saveDevotionalComplete(false);
         }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    // Pet Logic: Helpers & Actions
    const updatePet = useCallback((newPetState) => {
        setPet(prev => {
            const merged = { ...prev, ...newPetState, lastUpdate: Date.now() };
            savePetState(merged);
            return merged;
        });
    }, []);

    const feedPet = useCallback((cost, hungerAmount) => {
        if (coins < cost) return false;

        spendCoins(cost);
        setPet(prev => {
            const newHunger = Math.min(100, prev.hunger + hungerAmount);
            const newState = {
                ...prev,
                hunger: newHunger,
                lastFedAt: new Date().toISOString(),
                lastInteractionAt: new Date().toISOString(),
                lastUpdate: Date.now()
            };
            savePetState(newState);
            return newState;
        });
        return true;
    }, [coins, spendCoins]);

    const playWithPet = useCallback((funAmount, energyCost) => {
        // Play doesn't cost coins, but costs pet energy
        setPet(prev => {
            if (prev.energy < 5) return prev; // Too tired to play

            const newFun = Math.min(100, prev.fun + funAmount);
            const newEnergy = Math.max(0, prev.energy - energyCost);

            const newState = {
                ...prev,
                fun: newFun,
                energy: newEnergy,
                lastPlayedAt: new Date().toISOString(),
                lastInteractionAt: new Date().toISOString(),
                lastUpdate: Date.now()
            };
            savePetState(newState);
            return newState;
        });
        return true;
    }, []);

    const restPet = useCallback((energyAmount) => {
        setPet(prev => {
            const newEnergy = Math.min(100, prev.energy + energyAmount);
            // Rest also recovers a bit of fun if very low, or maintains it
            const newFun = Math.min(100, prev.fun + 5);

            const newState = {
                ...prev,
                energy: newEnergy,
                fun: newFun,
                lastInteractionAt: new Date().toISOString(),
                lastUpdate: Date.now()
            };
            savePetState(newState);
            return newState;
        });
    }, []);

    // Pet Logic: Daily Decay (Runs on mount)
    useEffect(() => {
        const now = Date.now();
        const lastUpdate = pet.lastUpdate || now;
        const hoursPassed = (now - lastUpdate) / (1000 * 60 * 60);

        // Run decay if more than 1 hour passed
        if (hoursPassed >= 1) {
            const daysPassed = Math.floor(hoursPassed / 24);
            // Decay factors (per hour, simplified)
            // If full days passed, decay significantly

            let hungerDecay = 0;
            let funDecay = 0;
            let energyDecay = 0;

            if (daysPassed >= 1) {
                // Heavy decay for missed days
                hungerDecay = 20 * daysPassed;
                funDecay = 15 * daysPassed;
                energyDecay = 10 * daysPassed;
            } else {
                // Hourly decay
                hungerDecay = Math.floor(hoursPassed * 0.5); // 12% in 24h
                funDecay = Math.floor(hoursPassed * 0.8);    // 19% in 24h
                energyDecay = Math.floor(hoursPassed * 0.4); // 9% in 24h
            }

            setPet(prev => {
                const newState = {
                    ...prev,
                    hunger: Math.max(0, prev.hunger - hungerDecay),
                    fun: Math.max(0, prev.fun - funDecay),
                    energy: Math.max(0, prev.energy - energyDecay),
                    lastUpdate: now
                };
                savePetState(newState);
                return newState;
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run once on mount

    // Progress Management
    const completeDay = useCallback((dayIndex, stars = 3) => {
        // Update max day if it's the next day
        if (dayIndex > lastCompletedDay) {
            setLastCompletedDay(dayIndex);
            saveLastCompletedDay(dayIndex);
        }

        // Record stars for this day
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
             // Reset streak if missed a day (and not today)
             setStreak(1);
             saveStreak(1);
        }

        if (lastDate !== today) {
            setLastDate(today);
            saveLastDate(today);

            // TAMAGOTCHI: Daily Check-in Bonus (Well Cared)
            // Only increment once per day
            setPet(prev => {
                const newDaysWellCared = (prev.daysWellCared || 0) + 1;
                let newStage = prev.stage;

                // Evolution Logic
                if (prev.stage === 'filhote' && newDaysWellCared >= 7) {
                    newStage = 'crianca';
                } else if (prev.stage === 'crianca' && newDaysWellCared >= 30) {
                    newStage = 'preadolescente';
                }

                const newState = {
                    ...prev,
                    daysWellCared: newDaysWellCared,
                    stage: newStage,
                    // Boost stats slightly on check-in reward
                    fun: Math.min(100, prev.fun + 10),
                    energy: Math.min(100, prev.energy + 10),
                    lastUpdate: Date.now()
                };
                savePetState(newState);
                return newState;
            });
        }

    }, [lastCompletedDay, lastDate, streak]);


    // Devotional Management
    const completeDevotional = useCallback(() => {
        const today = new Date().toDateString();
        setDevotionalComplete(true);
        saveDevotionalComplete(true);
        saveDevotionalDate(today);
        addCoins(10); // Reward

        // Boost pet fun
        updatePet({
            fun: Math.min(100, pet.fun + 20)
        });
    }, [addCoins, pet.fun, updatePet]);

    const value = {
        coins,
        addCoins,
        spendCoins,
        lastCompletedDay,
        completeDay,
        streak,
        pet,
        updatePet,
        feedPet,
        playWithPet,
        restPet,
        completedDays,
        devotionalComplete,
        completeDevotional
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
