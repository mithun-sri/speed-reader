export type GameMode = typeof STANDARD_MODE | typeof ADAPTIVE_MODE;

export const STANDARD_MODE = "Standard Mode";
export const ADAPTIVE_MODE = "Adaptive Mode";

export type GameDifficulty = typeof EASY | typeof MED | typeof HARD;

export const EASY = "Easy";
export const MED = "Medium";
export const HARD = "Hard";

export const COOKIE_CONSENT_COOKIE = "hasConsentedToCookies";

export function calculateAverageWpm(intervalWpms: number[]) {
  if (intervalWpms.length === 0) {
    return 0;
  }

  const sum = intervalWpms.reduce((acc, currentValue) => acc + currentValue, 0);
  return Math.ceil(sum / intervalWpms.length);
}
