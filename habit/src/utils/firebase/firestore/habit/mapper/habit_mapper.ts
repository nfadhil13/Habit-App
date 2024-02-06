import Day, { DayEnumHelper } from "@/models/day";
import {
  DailyHabitModel,
  HabitModel,
  WeeklyHabitModel,
} from "@/models/habit/Habit";
import NewHabitFormModel from "@/models/habit/NewHabit";
import TrackingType, { TrackingTypeHelper } from "@/models/habit/TrackingType";
import { toStartOfUTC } from "@/utils/date_util";
import { Timestamp } from "firebase-admin/firestore";

const habitMapper = (data: FirebaseFirestore.DocumentData): HabitModel => {
  return {
    currentStreak: data.get("currentStreak") ?? 0,
    habitName: data.get("name") ?? 0,
    histories: [],
    longestStreak: data.get("longestStreak") ?? 0,
    startDate: (data.get("startDate") as Timestamp).toDate().getTime(),
    id: data.get("id"),
    trackingType: TrackingTypeHelper.createTrackingType(
      data.get("trackingType")
    )!,
  };
};

const dailyMapper = (
  habit: HabitModel,
  data: FirebaseFirestore.DocumentData
): DailyHabitModel => {
  return {
    ...habit,
    trackingType: TrackingType.daily,
    schedule: (data.get("schedule") as number[]).map((value) =>
      DayEnumHelper.createDaily(value)
    ),
  };
};

const weeklyMapper = (
  habit: HabitModel,
  data: FirebaseFirestore.DocumentData
): WeeklyHabitModel => {
  return {
    ...habit,
    trackingType: TrackingType.weekly,
    weeklyGoal: data.get("weeklyGoal"),
  };
};

const fromFirestore = (data: FirebaseFirestore.DocumentData) => {
  const habit = habitMapper(data);
  const { trackingType } = habit;
  switch (trackingType) {
    case TrackingType.daily:
      return dailyMapper(habit, data);
    case TrackingType.weekly:
      return weeklyMapper(habit, data);
  }
};

const HabitFirestoreMapper = {
  fromFirestore,
};

export default HabitFirestoreMapper;
