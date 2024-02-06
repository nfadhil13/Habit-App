import HabitLogModel from "../../../types/habit/HabitLog";
import { isToday } from "../../../utils/date_util";
import { CalculateResult } from "../types/calculate_result";

// Calculate Daily Streak
export const calculateDailyStreak = (
  logs: HabitLogModel[],
  findMaxValue: boolean,
): CalculateResult => {
  let longestStreak = 0;
  let currentStreak = 0;

  for (let i = 0; i < logs.length; i++) {
    const { isDone, date } = logs[i];

    if (isDone) {
      currentStreak++;
    } else {
      //  If  'IsDone' is false , it means that the streak is broken
      // Skip today from exiting the loop because the user still have change to do the task
      const isLogHappenToday = isToday(date);
      if (!findMaxValue && !isLogHappenToday) {
        return {
          currentStreak,
          shouldContinueToNext: false,
        };
      }
      longestStreak = Math.max(currentStreak, longestStreak);
      currentStreak = 0;
    }
  }
  return {
    currentStreak: longestStreak,
    shouldContinueToNext: logs[logs.length - 1].isDone,
  };
};
