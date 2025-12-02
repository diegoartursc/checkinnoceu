import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  getLastCompletedDay,
  setLastCompletedDay,
  getStreak,
  setStreak,
  getCompletedDays,
  setCompletedDays,
  getLastDate,
  setLastDate
} from '../services/storage';

const ProgressContext = createContext();

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
};

export const ProgressProvider = ({ children }) => {
  const [lastCompletedDay, setLastCompletedDayState] = useState(() => getLastCompletedDay());
  const [streak, setStreakState] = useState(() => getStreak());
  const [completedDays, setCompletedDaysState] = useState(() => getCompletedDays());
  const [lastDate, setLastDateState] = useState(() => getLastDate());

  const updateLastCompletedDay = useCallback((day) => {
    setLastCompletedDay(day);
    setLastCompletedDayState(day);
  }, []);

  const updateStreak = useCallback((newStreak) => {
    setStreak(newStreak);
    setStreakState(newStreak);
  }, []);

  const updateCompletedDays = useCallback((days) => {
    setCompletedDays(days);
    setCompletedDaysState(days);
  }, []);

  const updateLastDate = useCallback((date) => {
    setLastDate(date);
    setLastDateState(date);
  }, []);

  const completeDay = useCallback((dayIndex, stars = 3) => {
    const newCompletedDays = { ...completedDays, [dayIndex]: stars };
    updateCompletedDays(newCompletedDays);
    updateLastCompletedDay(dayIndex);

    const today = new Date().toDateString();
    updateLastDate(today);

    return newCompletedDays;
  }, [completedDays, updateCompletedDays, updateLastCompletedDay, updateLastDate]);

  return (
    <ProgressContext.Provider
      value={{
        lastCompletedDay,
        streak,
        completedDays,
        lastDate,
        updateLastCompletedDay,
        updateStreak,
        updateCompletedDays,
        updateLastDate,
        completeDay
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};
