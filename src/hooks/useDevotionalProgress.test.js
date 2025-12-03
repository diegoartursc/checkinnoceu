import { describe, it, expect, vi } from 'vitest';
import { useDevotionalProgress } from './useDevotionalProgress';
import * as UserContext from '../contexts/UserContext';

// Mock the context hook
vi.mock('../contexts/UserContext', () => ({
  useUser: vi.fn(),
}));

describe('useDevotionalProgress', () => {
  it('getCurrentDayIndex returns lastCompletedDay if devotional is complete', () => {
    UserContext.useUser.mockReturnValue({
      lastCompletedDay: 5,
      devotionalComplete: true,
      devotionalStatus: { goodActionCompleted: true },
      completedDays: {}
    });

    const { getCurrentDayIndex } = useDevotionalProgress();
    expect(getCurrentDayIndex()).toBe(5);
  });

  it('getCurrentDayIndex returns lastCompletedDay + 1 if devotional is NOT complete', () => {
    UserContext.useUser.mockReturnValue({
      lastCompletedDay: 5,
      devotionalComplete: false,
      devotionalStatus: { goodActionCompleted: false },
      completedDays: {}
    });

    const { getCurrentDayIndex } = useDevotionalProgress();
    expect(getCurrentDayIndex()).toBe(6);
  });

  it('getDayStatus returns completed for past days', () => {
    UserContext.useUser.mockReturnValue({
      lastCompletedDay: 5,
      devotionalComplete: true,
      devotionalStatus: {},
      completedDays: {}
    });

    const { getDayStatus } = useDevotionalProgress();
    expect(getDayStatus(0)).toBe('completed');
    expect(getDayStatus(5)).toBe('completed');
  });

  it('getDayStatus returns locked for next day', () => {
    UserContext.useUser.mockReturnValue({
      lastCompletedDay: 5,
      devotionalComplete: true, // Today is done
      devotionalStatus: {},
      completedDays: {}
    });

    // If today is done, next day is locked
    const { getDayStatus } = useDevotionalProgress();
    expect(getDayStatus(6)).toBe('locked');
  });
});
