import { Timestamp } from "firebase-admin/firestore";
import TrackingType, { TrackingTypeHelper } from "../../../types/habit/TrackingType";
import { DayEnumHelper } from "../../../types/day";
import {
  DailyHabitHistoryModel,
  HabitHistoryModel,
  WeeklyHabitHistoryModel,
} from "../../../types/habit/HabitHistory";

const habitMapper = (data: FirebaseFirestore.DocumentData): HabitHistoryModel => {
  const trackingType = TrackingTypeHelper.createTrackingType(data.get("trackingType"));
  if (trackingType == undefined) throw Error("Invalid Trackign Type");
  return {
    startDate: (data.get("startDate") as Timestamp).toDate().getTime(),
    endDate: (data.get("endDate") as Timestamp).toDate().getTime(),
    id: data.get("id"),
    trackingType: trackingType,
  };
};

const dailyMapper = (
  habit: HabitHistoryModel,
  data: FirebaseFirestore.DocumentData,
): DailyHabitHistoryModel => {
  return {
    ...habit,
    trackingType: TrackingType.daily,
    schedule: (data.get("schedule") as number[]).map((value) => DayEnumHelper.createDaily(value)),
  };
};

const weeklyMapper = (
  habit: HabitHistoryModel,
  data: FirebaseFirestore.DocumentData,
): WeeklyHabitHistoryModel => {
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

const HabitHistoryFirestoreMapper = {
  fromFirestore,
};

export default HabitHistoryFirestoreMapper;
