import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getCoins, setCoins as saveCoins } from '../services/storage';

const CoinsContext = createContext();

export const useCoins = () => {
  const context = useContext(CoinsContext);
  if (!context) {
    throw new Error('useCoins must be used within CoinsProvider');
  }
  return context;
};

export const CoinsProvider = ({ children }) => {
  const [coins, setCoinsState] = useState(() => getCoins());

  const setCoins = useCallback((value) => {
    const newCoins = typeof value === 'function' ? value(coins) : value;
    const validated = saveCoins(newCoins);
    setCoinsState(validated);
  }, [coins]);

  const addCoins = useCallback((amount) => {
    setCoins(prev => prev + amount);
  }, [setCoins]);

  const spendCoins = useCallback((amount) => {
    if (coins >= amount) {
      setCoins(prev => prev - amount);
      return true;
    }
    return false;
  }, [coins, setCoins]);

  return (
    <CoinsContext.Provider value={{ coins, setCoins, addCoins, spendCoins }}>
      {children}
    </CoinsContext.Provider>
  );
};
