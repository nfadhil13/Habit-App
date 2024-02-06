import Day from "../day";
import TrackingType from "./TrackingType";

interface HabitHistoryModel {
  id: String;
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

export type {
  HabitHistoryModel,
  DailyHabitHistoryModel,
  WeeklyHabitHistoryModel,
};
