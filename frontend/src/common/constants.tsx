export type GameMode =
  | typeof STANDARD_MODE
  | typeof ADAPTIVE_MODE
  | typeof SUMMARISED_ADAPTIVE_MODE;

export const STANDARD_MODE = "Standard Mode";
export const ADAPTIVE_MODE = "Adaptive Mode";
export const SUMMARISED_ADAPTIVE_MODE = "Summarised Adaptive Mode";

export type GameDifficulty = typeof EASY | typeof MED | typeof HARD;

export const EASY = "Easy";
export const MED = "Medium";
export const HARD = "Hard";

export const PATH_STANDARD_MODE_1 = "/mode-standard-1";
export const PATH_STANDARD_MODE_2 = "/mode-standard-2";
export const PATH_ADAPTIVE_MODE = "/mode-adaptive";
export const PATH_SUMMARISED_ADAPTIVE_MODE = "/mode-summarised";
