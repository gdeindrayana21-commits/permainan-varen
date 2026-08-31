/**
 * Utility functions for randomizing and shuffling questions, answers, and game states
 */

/**
 * Perform an in-place Fisher-Yates shuffle on an array and return a new shuffled copy
 */
export function shuffleArray<T>(array: readonly T[] | T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * Pick random N distinct items from an array
 */
export function getRandomSubset<T>(array: readonly T[] | T[], count: number): T[] {
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Pick one random element from an array
 */
export function pickRandom<T>(array: readonly T[] | T[]): T {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}
