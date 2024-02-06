import { Timestamp, getFirestore } from "firebase-admin/firestore";
import { HabitHistoryModel } from "../../types/habit/HabitHistory";
import { FirestoreCollections } from "../../utils/firebase/colletion";
import { CalculateResult } from "./types/calculate_result";
import HabitLogFirestoreMapper from "../../firestore_mapper/habit/mapper/habit_log";
import TrackingType from "../../types/habit/TrackingType";
import { toStartOfUTC } from "../../utils/date_util";
import { calculateDailyStreak } from "./calculate_by_tracking/calculate_daily";
import { calculateWeeklyStreak } from "./calculate_by_tracking/calculate_weekly";
import HabitHistoryFirestoreMapper from "../../firestore_mapper/habit/mapper/habit_history";
import HabitFirestoreMapper from "../../firestore_mapper/habit/mapper/habit_mapper";
import { HabitModel } from "../../types/habit/Habit";
import { log } from "firebase-functions/logger";
import moment = require("moment");

const habitCollection = FirestoreCollections.habit.key;
const logCollection = FirestoreCollections.habit.subCollections.log.key;
const historyCollection = FirestoreCollections.habit.subCollections.history.key;

export const getCurrentHabit = async (habitId: string): Promise<HabitModel | undefined> => {
  const firestore = getFirestore();
  log("FETCHING DOC OF HABIT " + habitId);
  const docs = await firestore.collection(habitCollection).doc(habitId).get();

  log("FETCHING GOT RESULT OF DOC " + docs);
  if (docs == undefined) return undefined;

  log("PARSING DOCS TO " + docs);
  return HabitFirestoreMapper.fromFirestore(docs);
};

export const getOldSettingByEndDate = async (
  habitId: string,
  endDate: number,
): Promise<HabitHistoryModel | undefined> => {
  const firestore = getFirestore();
  // Get List of Log for specific habit setting
  const oldHabitSettingCall = await firestore
    .collection(`${habitCollection}/${habitId}/${historyCollection}`)
    .where("endDate", "==", dateNumberToTimestamp(endDate))
    .orderBy("date", "desc")
    .get();
  log("FIND OLD HABIT WITH LENGTH OF   " + oldHabitSettingCall);

  // IF NO ANY SETTING FOR GIVEN END DATE JUST EXIT THE FUNCTION
  const isHabitSettingExist = oldHabitSettingCall.docs.length == 1;
  if (!isHabitSettingExist) return undefined;
  return HabitHistoryFirestoreMapper.fromFirestore(oldHabitSettingCall.docs[0]);
};

export const calculateStreakByHabitSetting = async ({
  habitId,
  endDate,
  startDate,
  trackingType,
  weeklyGoal,
  findMaxValue,
}: {
  habitId: string;
  weeklyGoal: number;
  findMaxValue: boolean;
} & Omit<HabitHistoryModel, "id">): Promise<CalculateResult> => {
  const firestore = getFirestore();

  log(
    "Getting streak from " +
      moment(toStartOfUTC(new Date(endDate))).format("MMMM Do YYYY, h:mm:ss a") +
      " to " +
      moment(toStartOfUTC(new Date(startDate))).format("MMMM Do YYYY, h:mm:ss a"),
  );

  // Get List of Log for specific habit setting
  const logListFirestoreCall = await firestore
    .collection(`${habitCollection}/${habitId}/${logCollection}`)
    .where("date", ">=", dateNumberToTimestamp(startDate))
    .where("date", "<=", dateNumberToTimestamp(endDate))
    .orderBy("date", "desc")
    .get();

  const logList = logListFirestoreCall.docs.map((value) =>
    HabitLogFirestoreMapper.fromFireStore(value),
  );

  log(
    "Get logs  " +
      logList
        .map((value) => moment(value.date).format("MMMM Do YYYY") + " " + value.isDone)
        .join(","),
  );

  if (trackingType == TrackingType.daily) return calculateDailyStreak(logList, findMaxValue);
  return calculateWeeklyStreak(logList, weeklyGoal, findMaxValue);
};

// Map Date from Number to server timestamp in UTC Format
export const dateNumberToTimestamp = (dateInNumber: number) =>
  Timestamp.fromDate(toStartOfUTC(new Date(dateInNumber)));
