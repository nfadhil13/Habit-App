import { HabitModel, isWeeklyHabit } from "../../types/habit/Habit";
import { HabitHistoryModel, isWeeklyHabitHistory } from "../../types/habit/HabitHistory";
import { daysBeforeDate, toStartOfUTC } from "../../utils/date_util";
import { CalculateResult } from "./types/calculate_result";
import { calculateStreakByHabitSetting, getOldSettingByEndDate } from "./util";
import { log } from "firebase-functions/logger";

export const calculateCurrentStreak = async (habit: HabitModel): Promise<number | undefined> => {
  let currentStreak = 0;

  const { id: habitId } = habit;

  const { shouldContinueToNext, currentStreak: currentSettingStreak } =
    await calculateStreakByHabitSetting({
      endDate: toStartOfUTC(new Date()).getTime(),
      habitId: habit.id,
      startDate: habit.startDate,
      trackingType: habit.trackingType,
      weeklyGoal: isWeeklyHabit(habit) ? habit.weeklyGoal : 0,
      findMaxValue: false,
    });

  log("Current Streak is in current  " + currentSettingStreak + "  " + shouldContinueToNext);

  // Exit if the streak is broken
  if (!shouldContinueToNext) return currentSettingStreak;

  // End Date of Old setting = End Date of Current Setting - 1 day;
  let endDate: number | undefined = toStartOfUTC(
    daysBeforeDate({
      days: 1,
      date: new Date(habit.startDate),
    }),
  ).getTime();
  while (endDate != undefined) {
    const oldHabitSetting: HabitHistoryModel | undefined = await getOldSettingByEndDate(
      habitId,
      endDate,
    );
    if (oldHabitSetting == undefined) {
      endDate = undefined;
    } else {
      const { currentStreak: oldSettingSteak, shouldContinueToNext }: CalculateResult =
        await calculateStreakByHabitSetting({
          endDate: oldHabitSetting.endDate,
          habitId: habitId,
          startDate: oldHabitSetting.startDate,
          trackingType: oldHabitSetting.trackingType,
          weeklyGoal: isWeeklyHabitHistory(oldHabitSetting) ? oldHabitSetting.weeklyGoal : 0,
          findMaxValue: false,
        });
      currentStreak += oldSettingSteak;
      // IF Streak isn't stop yet, than continue to next setting
      const oldHabitStartDate = toStartOfUTC(
        daysBeforeDate({
          days: 1,
          date: new Date(oldHabitSetting.endDate),
        }),
      );
      endDate = shouldContinueToNext ? oldHabitStartDate.getTime() : undefined;
    }
  }

  return currentStreak;
};
