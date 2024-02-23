export type GameMode =
  | typeof STANDARD_MODE
  | typeof ADAPTIVE_MODE
  | typeof SUMMARISED_MODE;

export const STANDARD_MODE = "Standard Mode";
export const ADAPTIVE_MODE = "Adaptive Mode";
export const SUMMARISED_MODE = "Summarised Mode";

export type GameDifficulty = typeof EASY | typeof MED | typeof HARD;

export const EASY = "Easy";
export const MED = "Medium";
export const HARD = "Hard";

export function calculateAverageWpm(intervalWpms: number[]) {
  if (intervalWpms.length === 0) {
    return 0;
  }

  const sum = intervalWpms.reduce((acc, currentValue) => acc + currentValue, 0);
  return Math.ceil(sum / intervalWpms.length);
}
