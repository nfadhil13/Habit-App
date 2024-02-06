import Day from "../day";
import TrackingType from "./TrackingType";

interface HabitHistoryModel {
  id: string;
  startDate: number;
  endDate: number;
  trackingType: TrackingType;
}

interface DailyHabitHistoryModel extends HabitHistoryModel {
  trackingType: TrackingType.daily;
  schedule: Day[];
}

interface WeeklyHabitHistoryModel extends HabitHistoryModel {
  trackingType: TrackingType.weekly;
  weeklyGoal: number;
}

export const isWeeklyHabitHistory = (habit: HabitHistoryModel): habit is WeeklyHabitHistoryModel =>
  habit.trackingType == TrackingType.weekly;

export type { HabitHistoryModel, DailyHabitHistoryModel, WeeklyHabitHistoryModel };
