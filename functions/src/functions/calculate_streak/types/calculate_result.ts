export type CalculateResult = {
  // Number of streak for specific habit setting
  currentStreak: number;

  // Should the calculation continue to next habit setting
  shouldContinueToNext: boolean;
};
