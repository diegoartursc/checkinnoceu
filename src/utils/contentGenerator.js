import { VERSES, MESSAGES, QUIZZES } from '../constants/content';
import { seededRandom } from './dateUtils';

/**
 * Generate deterministic daily content based on day number
 */
export const getDailyContent = (dayNumber) => {
  // Select content based on day (deterministic)
  const verseIndex = Math.floor(seededRandom(dayNumber * 7) * VERSES.length);
  const messageIndex = Math.floor(seededRandom(dayNumber * 13) * MESSAGES.length);
  const quizIndex = Math.floor(seededRandom(dayNumber * 19) * QUIZZES.length);

  return {
    day: dayNumber,
    message: MESSAGES[messageIndex],
    verse: VERSES[verseIndex],
    quiz: QUIZZES[quizIndex]
  };
};
