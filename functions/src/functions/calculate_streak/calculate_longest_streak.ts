import { HabitModel, isWeeklyHabit } from "../../types/habit/Habit";
import { HabitHistoryModel, isWeeklyHabitHistory } from "../../types/habit/HabitHistory";
import { daysBeforeDate, toStartOfUTC } from "../../utils/date_util";
import { CalculateResult } from "./types/calculate_result";
import { calculateStreakByHabitSetting, getOldSettingByEndDate } from "./util";
import { log } from "firebase-functions/logger";

export const calculateLongestStreak = async (habit: HabitModel): Promise<number | undefined> => {
  let longestStreak = 0;

  const { id: habitId } = habit;

  log("START CALCULATING LONGEST STREAK FOR " + habit.habitName);

  const { shouldContinueToNext, currentStreak: currentSettingStreak } =
    await calculateStreakByHabitSetting({
      endDate: toStartOfUTC(new Date()).getTime(),
      habitId: habit.id,
      startDate: habit.startDate,
      trackingType: habit.trackingType,
      weeklyGoal: isWeeklyHabit(habit) ? habit.weeklyGoal : 0,
      findMaxValue: true,
    });

  log("Current Streak is " + currentSettingStreak);

  longestStreak = currentSettingStreak;

  // End Date of Old setting = End Date of Current Setting - 1 day;
  let endDate: number | undefined = toStartOfUTC(
    daysBeforeDate({
      days: 1,
      date: new Date(habit.startDate),
    }),
  ).getTime();
  log("Prepare to get more " + new Date(endDate).toISOString());
  let isPreviousStreakContinue = shouldContinueToNext;
  let currentStreak = longestStreak;
  while (endDate != undefined) {
    log("TRY TO FIND OLD HABIT  ");
    const oldHabitSetting: HabitHistoryModel | undefined = await getOldSettingByEndDate(
      habitId,
      endDate,
    );
    log("DO NOT FOUND ANY OLD HABIT OR NOT  " + oldHabitSetting);
    if (oldHabitSetting == undefined) {
      endDate = undefined;
    } else {
      const {
        currentStreak: oldSettingStreak,
        shouldContinueToNext: isCurrentStreakContinue,
      }: CalculateResult = await calculateStreakByHabitSetting({
        endDate: endDate,
        habitId: habitId,
        startDate: oldHabitSetting.startDate,
        trackingType: oldHabitSetting.trackingType,
        weeklyGoal: isWeeklyHabitHistory(oldHabitSetting) ? oldHabitSetting.weeklyGoal : 0,
        findMaxValue: true,
      });
      if (isPreviousStreakContinue) {
        currentStreak += oldSettingStreak;
      } else {
        currentStreak = oldSettingStreak;
      }
      if (!isCurrentStreakContinue) {
        longestStreak = Math.max(currentStreak, longestStreak);
      }
      isPreviousStreakContinue = isCurrentStreakContinue;
      endDate = toStartOfUTC(
        daysBeforeDate({
          days: 1,
          date: new Date(oldHabitSetting.startDate),
        }),
      ).getTime();
    }
  }
  log("LONGEST STREAK IS " + longestStreak);
  return longestStreak;
};
