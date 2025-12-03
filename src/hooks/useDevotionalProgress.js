import { useUser } from '../contexts/UserContext';
import { calculateDayIndexInYear } from '../utils/mapUtils';
import { MONTHS_CONFIG } from '../config/gameConfig';

/**
 * Hook to manage devotional progress and map status logic
 */
export const useDevotionalProgress = () => {
  const {
    lastCompletedDay,
    devotionalComplete,
    devotionalStatus,
    completedDays
  } = useUser();

  /**
   * Calculates the currently active day index.
   * Logic:
   * - If today's devotional is done (goodActionCompleted), the current day is treated as completed in the flow,
   *   so the "Active" day might be the next one (locked) or the current one (completed).
   * - However, typically "Current Day" means the day the user is ON.
   *   If they finished Day 5, they are waiting for Day 6.
   *   But visually, we want to highlight Day 5 as the one they just conquered.
   *
   * Current implementation: Returns the day index that should be highlighted or focused.
   */
  const getCurrentDayIndex = () => {
    // If today is done, the "current" day in terms of progress is effectively the last completed day
    // because the next day is locked until tomorrow.
    if (devotionalComplete) {
      return lastCompletedDay;
    }
    // If not done, it's the next day after the last fully completed one
    return lastCompletedDay + 1;
  };

  /**
   * Determines the visual status of a day node.
   * @param {number} dayIndex - The global day index (0-365)
   * @returns {'locked' | 'current' | 'completed'}
   */
  const getDayStatus = (dayIndex) => {
    // Day is strictly in the past (fully completed previously)
    if (dayIndex <= lastCompletedDay) {
      return 'completed';
    }

    // Day is the next immediate step
    if (dayIndex === lastCompletedDay + 1) {
       // Since the map is only shown when devotionalComplete is true,
       // effectively the user has "caught up" to this day or passed it.
       // However, strictly speaking, if lastCompletedDay is yesterday,
       // and we haven't marked today as "completed" in the generic sense (maybe waiting for something else?),
       // it would be 'current'.
       // But in current flow: devotionalComplete -> marks today as completed -> lastCompletedDay updates.
       // So dayIndex === lastCompletedDay is 'completed'.
       // dayIndex === lastCompletedDay + 1 is 'locked' (tomorrow).

       return 'locked';
    }

    // Future days
    return 'locked';
  };

  /**
   * Checks if a day is the "Active" day (the one focused by the user today).
   * If the user just finished Day X, Day X is active (just won).
   */
  const isDayActive = (dayIndex) => {
      return dayIndex === lastCompletedDay;
  };

  return {
    getCurrentDayIndex,
    getDayStatus,
    isDayActive,
    devotionalStatus,
    completedDays
  };
};
