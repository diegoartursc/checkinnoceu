// src/context/UserProgressContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';

interface UserProgressContextType {
    coins: number;
    lastCompletedDay: number;
    unlockedStories: string[];
    readStories: string[];
    streak: number;
    addCoins: (amount: number) => void;
    spendCoins: (amount: number) => void;
    completeDay: (day: number) => void;
    unlockStory: (storyId: string) => void;
    markStoryRead: (storyId: string) => void;
    streakBonus: { show: boolean; amount: number; close: () => void };
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

export const UserProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [coins, setCoins] = useState(() => parseInt(localStorage.getItem('checkin_coins') || '0'));
    const [lastCompletedDay, setLastCompletedDay] = useState(() => parseInt(localStorage.getItem('checkin_day') || '330'));
    const [unlockedStories, setUnlockedStories] = useState<string[]>(() => JSON.parse(localStorage.getItem('checkin_stories') || '[]'));
    const [readStories, setReadStories] = useState<string[]>(() => JSON.parse(localStorage.getItem('checkin_read_stories') || '[]'));
    const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('checkin_streak') || '0'));
    const [lastCheckInDate, setLastCheckInDate] = useState<string | null>(() => localStorage.getItem('checkin_last_date'));
    const [streakBonus, setStreakBonus] = useState<{ show: boolean; amount: number }>({ show: false, amount: 0 });

    const addCoins = useCallback((amount: number) => {
        setCoins(prev => {
            const newTotal = prev + amount;
            localStorage.setItem('checkin_coins', newTotal.toString());
            return newTotal;
        });
    }, []);

    const spendCoins = useCallback((amount: number) => {
        setCoins(prev => {
            const newTotal = Math.max(0, prev - amount);
            localStorage.setItem('checkin_coins', newTotal.toString());
            return newTotal;
        });
    }, []);

    const unlockStory = useCallback((storyId: string) => {
        setUnlockedStories(prev => {
            if (prev.includes(storyId)) return prev;
            const newStories = [...prev, storyId];
            localStorage.setItem('checkin_stories', JSON.stringify(newStories));
            return newStories;
        });
    }, []);

    const markStoryRead = useCallback((storyId: string) => {
        setReadStories(prev => {
            if (prev.includes(storyId)) return prev;
            const newRead = [...prev, storyId];
            localStorage.setItem('checkin_read_stories', JSON.stringify(newRead));
            return newRead;
        });
    }, []);

    const completeDay = useCallback((day: number) => {
        if (day <= lastCompletedDay) return; // Already completed

        setLastCompletedDay(day);
        localStorage.setItem('checkin_day', day.toString());

        addCoins(10);

        // Calculate streak
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        let newStreak = 1;
        let bonusStars = 0;

        if (lastCheckInDate === yesterday) {
            newStreak = streak + 1;
            if (newStreak === 7) bonusStars = 100;
            else if (newStreak === 30) bonusStars = 500;
            else if (newStreak === 90) bonusStars = 2000;
        } else if (lastCheckInDate !== today) {
            newStreak = 1;
        } else {
            newStreak = streak;
        }

        setStreak(newStreak);
        setLastCheckInDate(today);
        localStorage.setItem('checkin_streak', newStreak.toString());
        localStorage.setItem('checkin_last_date', today);

        if (bonusStars > 0) {
            addCoins(bonusStars);
            setStreakBonus({ show: true, amount: bonusStars });
        }
    }, [lastCompletedDay, lastCheckInDate, streak, addCoins]);

    const closeStreakBonus = useCallback(() => {
        setStreakBonus({ show: false, amount: 0 });
    }, []);

    return (
        <UserProgressContext.Provider value={{
            coins,
            lastCompletedDay,
            unlockedStories,
            readStories,
            streak,
            addCoins,
            spendCoins,
            completeDay,
            unlockStory,
            markStoryRead,
            streakBonus: { ...streakBonus, close: closeStreakBonus }
        }}>
            {children}
        </UserProgressContext.Provider>
    );
};

export const useUserProgress = () => {
    const context = useContext(UserProgressContext);
    if (!context) {
        throw new Error('useUserProgress must be used within a UserProgressProvider');
    }
    return context;
};
