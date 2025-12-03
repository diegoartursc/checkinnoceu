/**
 * Storage Service with Validation
 * Provides secure localStorage operations with data validation
 */

// Storage keys
export const STORAGE_KEYS = {
  DAY: 'checkin_day',
  COINS: 'checkin_coins',
  STREAK: 'checkin_streak',
  LAST_DATE: 'checkin_last_date',
  STORIES: 'checkin_stories',
  READ_STORIES: 'checkin_read_stories',
  PET: 'checkin_pet',
  COMPLETED_DAYS: 'checkin_completed_days',
  DEVOTIONAL_DATE: 'devotional_date',
  DEVOTIONAL_COMPLETE: 'devotional_complete',
  DEVOTIONAL_STATUS: 'devotional_status'
};

// Validation limits
const LIMITS = {
  MAX_COINS: 100000,
  MAX_DAY: 364,
  MAX_STREAK: 365,
  MIN_VALUE: 0
};

/**
 * Validate and sanitize a number value
 */
const validateNumber = (value, min = LIMITS.MIN_VALUE, max) => {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) return min;
  if (parsed < min) return min;
  if (max !== undefined && parsed > max) return max;
  return parsed;
};

/**
 * Validate and parse JSON data
 */
const validateJSON = (value, fallback = {}) => {
  try {
    const parsed = JSON.parse(value);
    return parsed !== null && typeof parsed === 'object' ? parsed : fallback;
  } catch {
    return fallback;
  }
};

/**
 * Get validated coins from storage
 */
export const getCoins = () => {
  const value = localStorage.getItem(STORAGE_KEYS.COINS);
  return validateNumber(value, 0, LIMITS.MAX_COINS);
};

/**
 * Set coins with validation
 */
export const setCoins = (coins) => {
  const validated = validateNumber(coins, 0, LIMITS.MAX_COINS);
  localStorage.setItem(STORAGE_KEYS.COINS, validated.toString());
  return validated;
};

/**
 * Get validated day from storage
 */
export const getLastCompletedDay = () => {
  const value = localStorage.getItem(STORAGE_KEYS.DAY);
  return validateNumber(value, 0, LIMITS.MAX_DAY);
};

/**
 * Set last completed day with validation
 */
export const setLastCompletedDay = (day) => {
  const validated = validateNumber(day, 0, LIMITS.MAX_DAY);
  localStorage.setItem(STORAGE_KEYS.DAY, validated.toString());
  return validated;
};

/**
 * Get validated streak from storage
 */
export const getStreak = () => {
  const value = localStorage.getItem(STORAGE_KEYS.STREAK);
  return validateNumber(value, 0, LIMITS.MAX_STREAK);
};

/**
 * Set streak with validation
 */
export const setStreak = (streak) => {
  const validated = validateNumber(streak, 0, LIMITS.MAX_STREAK);
  localStorage.setItem(STORAGE_KEYS.STREAK, validated.toString());
  return validated;
};

/**
 * Get last check-in date
 */
export const getLastDate = () => {
  return localStorage.getItem(STORAGE_KEYS.LAST_DATE) || '';
};

/**
 * Set last check-in date
 */
export const setLastDate = (date) => {
  localStorage.setItem(STORAGE_KEYS.LAST_DATE, date);
};

/**
 * Get unlocked stories
 */
export const getUnlockedStories = () => {
  const value = localStorage.getItem(STORAGE_KEYS.STORIES);
  const parsed = validateJSON(value, []);
  return Array.isArray(parsed) ? parsed : [];
};

/**
 * Set unlocked stories
 */
export const setUnlockedStories = (stories) => {
  const validated = Array.isArray(stories) ? stories : [];
  localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(validated));
};

/**
 * Get read stories
 */
export const getReadStories = () => {
  const value = localStorage.getItem(STORAGE_KEYS.READ_STORIES);
  const parsed = validateJSON(value, []);
  return Array.isArray(parsed) ? parsed : [];
};

/**
 * Set read stories
 */
export const setReadStories = (stories) => {
  const validated = Array.isArray(stories) ? stories : [];
  localStorage.setItem(STORAGE_KEYS.READ_STORIES, JSON.stringify(validated));
};

/**
 * Get pet state
 */
export const getPetState = () => {
  const value = localStorage.getItem(STORAGE_KEYS.PET);
  const defaultPet = {
    type: 'sheep',
    hunger: 100,
    happiness: 100,
    energy: 100,
    lastUpdate: Date.now()
  };

  const pet = validateJSON(value, defaultPet);

  // Validate pet stats (0-100)
  if (pet.hunger !== undefined) pet.hunger = validateNumber(pet.hunger, 0, 100);
  if (pet.happiness !== undefined) pet.happiness = validateNumber(pet.happiness, 0, 100);
  if (pet.energy !== undefined) pet.energy = validateNumber(pet.energy, 0, 100);

  return pet;
};

/**
 * Set pet state
 */
export const setPetState = (pet) => {
  const validated = {
    ...pet,
    hunger: validateNumber(pet.hunger, 0, 100),
    happiness: validateNumber(pet.happiness, 0, 100),
    energy: validateNumber(pet.energy, 0, 100),
    lastUpdate: Date.now()
  };
  localStorage.setItem(STORAGE_KEYS.PET, JSON.stringify(validated));
  return validated;
};

/**
 * Get completed days
 */
export const getCompletedDays = () => {
  const value = localStorage.getItem(STORAGE_KEYS.COMPLETED_DAYS);
  return validateJSON(value, {});
};

/**
 * Set completed days
 */
export const setCompletedDays = (days) => {
  const validated = typeof days === 'object' && days !== null ? days : {};
  localStorage.setItem(STORAGE_KEYS.COMPLETED_DAYS, JSON.stringify(validated));
};

/**
 * Get devotional date
 */
export const getDevotionalDate = () => {
  return localStorage.getItem(STORAGE_KEYS.DEVOTIONAL_DATE) || '';
};

/**
 * Set devotional date
 */
export const setDevotionalDate = (date) => {
  localStorage.setItem(STORAGE_KEYS.DEVOTIONAL_DATE, date);
};

/**
 * Get devotional complete flag
 */
export const getDevotionalComplete = () => {
  const value = localStorage.getItem(STORAGE_KEYS.DEVOTIONAL_COMPLETE);
  return value === 'true';
};

/**
 * Set devotional complete flag
 */
export const setDevotionalComplete = (complete) => {
  localStorage.setItem(STORAGE_KEYS.DEVOTIONAL_COMPLETE, complete ? 'true' : 'false');
};

/**
 * Get devotional status object
 */
export const getDevotionalStatus = () => {
  const value = localStorage.getItem(STORAGE_KEYS.DEVOTIONAL_STATUS);
  const defaultStatus = {
    morningPrayerDone: false,
    gratitudeDone: false,
    goodActionChosen: false,
    goodActionCompleted: false,
    nightPrayerDone: false
  };
  return validateJSON(value, defaultStatus);
};

/**
 * Set devotional status object
 */
export const setDevotionalStatus = (status) => {
  const validated = typeof status === 'object' && status !== null ? status : {};
  localStorage.setItem(STORAGE_KEYS.DEVOTIONAL_STATUS, JSON.stringify(validated));
  return validated;
};

/**
 * Clear all storage (for testing/reset)
 */
export const clearAllStorage = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};
