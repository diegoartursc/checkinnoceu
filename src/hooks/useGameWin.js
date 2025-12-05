import { useEffect, useRef } from 'react';

/**
 * Custom hook to handle game win logic consistently across all mini-games.
 * Ensures onWin callback is only called once when win condition is met.
 *
 * @param {boolean} hasWon - Boolean indicating if the win condition is met
 * @param {Function} onWin - Callback function to execute when player wins
 * @param {number} delay - Optional delay in milliseconds before calling onWin (default: 0)
 */
export const useGameWin = (hasWon, onWin, delay = 0) => {
  const hasWonRef = useRef(false);

  useEffect(() => {
    if (hasWon && !hasWonRef.current) {
      hasWonRef.current = true;

      if (delay > 0) {
        setTimeout(onWin, delay);
      } else {
        onWin();
      }
    }
  }, [hasWon, onWin, delay]);
};
