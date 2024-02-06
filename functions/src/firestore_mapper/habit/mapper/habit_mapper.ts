import { Timestamp } from "firebase-admin/firestore";
import { DailyHabitModel, HabitModel, WeeklyHabitModel } from "../../../types/habit/Habit";
import TrackingType, { TrackingTypeHelper } from "../../../types/habit/TrackingType";
import { DayEnumHelper } from "../../../types/day";

const habitMapper = (data: FirebaseFirestore.DocumentData): HabitModel => {
  const trackingType = TrackingTypeHelper.createTrackingType(data.get("trackingType"));
  if (trackingType == undefined) throw Error("Invalid Trackign Type");
  return {
    currentStreak: data.get("currentStreak") ?? 0,
    habitName: data.get("name") ?? 0,
    histories: [],
    longestStreak: data.get("longestStreak") ?? 0,
    startDate: (data.get("startDate") as Timestamp).toDate().getTime(),
    id: data.get("id"),
    trackingType: trackingType,
  };
};

const dailyMapper = (habit: HabitModel, data: FirebaseFirestore.DocumentData): DailyHabitModel => {
  return {
    ...habit,
    trackingType: TrackingType.daily,
    schedule: (data.get("schedule") as number[]).map((value) => DayEnumHelper.createDaily(value)),
  };
};

const weeklyMapper = (
  habit: HabitModel,
  data: FirebaseFirestore.DocumentData,
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
  if (trackingType == TrackingType.daily) {
    return dailyMapper(habit, data);
  }
  return weeklyMapper(habit, data);
};

const HabitFirestoreMapper = {
  fromFirestore,
};

export default HabitFirestoreMapper;
