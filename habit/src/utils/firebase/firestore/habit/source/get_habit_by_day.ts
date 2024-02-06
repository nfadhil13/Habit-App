import { initAdmin } from "@/utils/firebase/firebase_config";
import { FirestoreCollections } from "../../config";
import { Timestamp, getFirestore } from "firebase-admin/firestore";
import DateUtils, { toStartOfUTC } from "@/utils/date_util";
import TrackingType from "@/models/habit/TrackingType";
import TodayHabitModel from "@/models/habit/TodayHabit";
import HabitFirestoreMapper from "../mapper/habit_mapper";
import {
  DailyHabitModel,
  HabitModel,
  WeeklyHabitModel,
} from "@/models/habit/Habit";
import HabitLogFirestoreMapper from "../mapper/habit_log";
import moment from "moment";

export const getTodayHabitByDay = async (
  date: Date,
  trackingType?: TrackingType
): Promise<TodayHabitModel[]> => {
  const habitCollectionKey = FirestoreCollections.habit;
  await initAdmin();
  const db = getFirestore();
  const habitCollection = db.collection(habitCollectionKey.key);
  const utcTimeStamp = toStartOfUTC(date);
  let habitQuery = habitCollection.where(
    "startDate",
    "<=",
    Timestamp.fromDate(utcTimeStamp)
  );
  if (trackingType != null) {
    habitQuery = habitQuery.where("trackingType", "==", trackingType);
    if (trackingType == TrackingType.daily) {
      habitQuery = habitQuery.where(
        "schedule",
        "array-contains",
        moment(utcTimeStamp).isoWeek()
      );
    }
  }
  const { docs } = await habitQuery.get();
  const habitList = docs.map((value) =>
    HabitFirestoreMapper.fromFirestore(value)
  );
  return await Promise.all(
    habitList.map((value) => getHabitLogByDate(value, utcTimeStamp))
  );
};

const getHabitLogByDate = async (
  habit: HabitModel,
  date: Date
): Promise<TodayHabitModel> => {
  const habitCollectionKey = FirestoreCollections.habit;
  await initAdmin();
  const db = getFirestore();
  const logCollection = db
    .collection(habitCollectionKey.key)
    .doc(habit.id)
    .collection(habitCollectionKey.subCollections.log.key);
  const { monday, sunday } = DateUtils.startAndEndOfWeek(date);
  const logAtGivenDate = await logCollection
    .where("date", ">=", Timestamp.fromDate(monday))
    .where("date", "<=", Timestamp.fromDate(sunday))
    .get();
  const logList = logAtGivenDate.docs.map((value) =>
    HabitLogFirestoreMapper.fromFireStore(value)
  );
  const result = {
    habit: habit,
    weekLog: logList,
    todayLog: logList.find((value) =>
      moment(toStartOfUTC(date)).isSame(toStartOfUTC(value.date))
    ),
  };

  return result;
};
