import moment = require("moment");
import HabitLogModel from "../../../types/habit/HabitLog";
import { CalculateResult } from "../types/calculate_result";
import { log } from "firebase-functions/logger";

// Calculate Weekly Streak
export const calculateWeeklyStreak = (
  logs: HabitLogModel[],
  weeklyGoal: number,
  findLongestStreak: boolean,
): CalculateResult => {
  let longestStreak = 0;
  let currentStreak = 0;
  let completedCount = 0;
  let currentWeekStartDate = null;
  let shouldContinueToNext = true;
  log("Weekly goal is " + 1);
  for (let i = 0; i < logs.length; i++) {
    const { isDone, date } = logs[i];
    log(
      "Looping for " + date.toString() + "isDone =" + isDone + " Current Streak " + currentStreak,
    );
    if (!currentWeekStartDate || isNewWeek(date, currentWeekStartDate)) {
      /**
       *  If it's a new week, reset completed count and update the current week start date
       *  If We are not trying findLongest streak then exit as soon as possible
       *  */

      // If on monday the completed count isn't meet the weekly goal that it means the streak is over
      const isMonday = moment(date).utc().isoWeekday() == 1;
      if (completedCount < weeklyGoal && currentWeekStartDate != undefined && isMonday) {
        if (!findLongestStreak) {
          log("Returning current strek of " + currentStreak);
          return {
            currentStreak,
            shouldContinueToNext: false,
          };
        }
        longestStreak = Math.max(currentStreak, longestStreak);
        if (completedCount < weeklyGoal) currentStreak = 0;
      }
      completedCount = 0;
      currentWeekStartDate = getStartOfWeek(date);
    }

    if (isDone) {
      // If a habit is done, increment completed count
      completedCount++;

      // Check if the completed count meets the weekly goal
      if (completedCount >= weeklyGoal) {
        currentStreak++;
        // Reset completed count for the next week
        completedCount = 0;
      }
    }

    // Check if the streak meets the weekly goal at the end of the log
    if (i === logs.length - 1 && completedCount < weeklyGoal) {
      shouldContinueToNext = false;
    }
  }

  return {
    currentStreak,
    shouldContinueToNext,
  };
};

// Helper function to check if a date is the start of a new week
const isNewWeek = (date: Date, currentWeekStartDate: Date | null): boolean => {
  if (!currentWeekStartDate) {
    return true; // Treat it as a new week if the current week start date is not set
  }
  const startOfWeek = moment(date).startOf("isoWeek").utc().toDate();
  return startOfWeek.getTime() !== currentWeekStartDate.getTime();
};

// Helper function to get the start of the week for a given date
const getStartOfWeek = (date: Date): Date => {
  const startOfWeek = moment(date).utc().startOf("isoWeek");
  return startOfWeek.toDate();
};
