import TrackingType from "./TrackingType";
import Day from "../day";
import { HabitHistoryModel } from "./HabitHistory";

interface HabitModel {
  id: string;
  habitName: string;
  trackingType: TrackingType;
  currentStreak: number;
  longestStreak: number;
  startDate: number;
  histories: HabitHistoryModel[];
}

interface DailyHabitModel extends HabitModel {
  trackingType: TrackingType.daily;
  schedule: Day[];
}

interface WeeklyHabitModel extends HabitModel {
  trackingType: TrackingType.weekly;
  weeklyGoal: number;
}

export const isWeeklyHabit = (habit: HabitModel): habit is WeeklyHabitModel =>
  habit.trackingType == TrackingType.weekly;

export const isDailyHabit = (habit: HabitModel): habit is DailyHabitModel =>
  habit.trackingType == TrackingType.daily;

export type { HabitModel, DailyHabitModel, WeeklyHabitModel };
