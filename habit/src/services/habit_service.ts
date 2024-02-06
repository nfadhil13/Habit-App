"server side";

import Day from "@/models/day";
import {
  DailyHabitModel,
  HabitModel,
  WeeklyHabitModel,
} from "@/models/habit/Habit";
import NewHabitFormModel from "@/models/habit/NewHabit";
import TodayHabitModel, {
  DailyTodayHabitModel,
  WeeklyTodayHabitModel,
} from "@/models/habit/TodayHabit";
import ToggleHabitModel from "@/models/habit/ToogleHabit";
import TrackingType, { TrackingTypeHelper } from "@/models/habit/TrackingType";
import FirestoreHabitDTS from "@/utils/firebase/firestore/habit/source";

const createNewHabit = async (newHabit: NewHabitFormModel) => {
  await FirestoreHabitDTS.createNewHabit(newHabit);
};

const toggleDailyHabitStatus = async ({
  habitId,
  isDone,
  logId,
}: ToggleHabitModel) => {
  return FirestoreHabitDTS.toogleDailyStatus({
    habitId,
    logId,
    isDone,
  });
};

const getAllHabit = async (): Promise<{
  daily: HabitModel[];
  weekly: HabitModel[];
}> => {
  const [daily, weekly] = await Promise.all(
    [TrackingType.daily, TrackingType.weekly].map((value) =>
      FirestoreHabitDTS.getAllHabit(value)
    )
  );

  return {
    daily: daily,
    weekly: weekly,
  };
};

const getHabitByDay = async (
  dayInNumber: number
): Promise<{
  daily: TodayHabitModel[];
  weekly: TodayHabitModel[];
}> => {
  const [daily, weekly] = await Promise.all(
    [TrackingType.daily, TrackingType.weekly].map((value) =>
      FirestoreHabitDTS.getTodayHabitByDay(new Date(dayInNumber), value)
    )
  );

  return {
    daily: daily,
    weekly: weekly,
  };
};

const HabitService = {
  createNewHabit,
  getHabitByDay,
  getAllHabit,
  toggleDailyHabitStatus,
};

export default HabitService;
