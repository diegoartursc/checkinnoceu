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
    getOnboardingComplete, setOnboardingComplete as saveOnboardingComplete
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
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => getOnboardingComplete());

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

    // Devotional Management
    const completeDevotional = useCallback(() => {
        const today = new Date().toDateString();
        setDevotionalComplete(true);
        saveDevotionalComplete(true);
        saveDevotionalDate(today);
        addCoins(10); // Reward

        // Boost pet happiness
        updatePet({
            happiness: Math.min(100, pet.happiness + 20)
        });
    }, [addCoins, pet.happiness, updatePet]);

    const completeOnboarding = useCallback(() => {
        setHasCompletedOnboarding(true);
        saveOnboardingComplete(true);
    }, []);

    const value = {
        coins,
        addCoins,
        spendCoins,
        lastCompletedDay,
        completeDay,
        streak,
        pet,
        updatePet,
        completedDays,
        devotionalComplete,
        completeDevotional,
        hasCompletedOnboarding,
        completeOnboarding
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
