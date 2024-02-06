import { Timestamp, getFirestore } from "firebase-admin/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { FirestoreCollections } from "../../utils/firebase/colletion";
import HabitLogModel from "../../types/habit/HabitLog";
import moment = require("moment");
import { HabitModel, isDailyHabit } from "../../types/habit/Habit";
import HabitFirestoreMapper from "../../firestore_mapper/habit/mapper/habit_mapper";
import PromisePool from "@supercharge/promise-pool";
import HabitLogFirestoreMapper from "../../firestore_mapper/habit/mapper/habit_log";
const habitCollection = FirestoreCollections.habit.key;
const logCollection = FirestoreCollections.habit.subCollections.log.key;

// Generate New Task For User Every 00:00 UTC
export const todayTaskGenerator = () =>
  onSchedule(
    {
      schedule: "every day 00:00",
      timeZone: "UTC",
    },
    async () => {
      const firestore = getFirestore();
      const tomorrow = moment().add(1, "days").utc().startOf("day").toDate();
      const allHabit = await firestore
        .collection(habitCollection)
        .where("startDate", "<=", Timestamp.fromDate(tomorrow))
        .get();

      // Use Concurrency pool to make the process fater
      await PromisePool.withConcurrency(3)
        .for(allHabit.docs)
        .process(async (value) => {
          const habit = HabitFirestoreMapper.fromFirestore(value);
          // Create Log By Habit
          const newLog = createNewLogByHabit(habit, tomorrow);
          if (newLog == undefined) return;
          await updateLogAndHabit(habit.id, newLog);
        });
    },
  );

const updateLogAndHabit = async (habitId: string, newLog: HabitLogModel) => {
  const firestore = getFirestore();
  const ref = firestore.collection(habitCollection).doc(habitId).collection(logCollection);
  await ref.add(HabitLogFirestoreMapper.toFirestore(newLog, ref.id));
};

/**
 * Add two numbers.
 * @param {HabitModel} habit The Habit that will be used for creating new log.
 * @param {Date} willBeAddedDate The Date log will beadded
 *
 * @return {HabitLogModel | undefined}
 * Return New HabitLog for the next day if it is needed ,
 * May return undefined for daily habit where the day isn't  the scheduled day.
 */
const createNewLogByHabit = (
  habit: HabitModel,
  willBeAddedDate: Date,
): HabitLogModel | undefined => {
  // For daily we need to check whether tomorrow is scheduled for the task
  const isScheduled = isDailyHabit(habit)
    ? habit.schedule.includes(moment(willBeAddedDate).isoWeekday())
    : true;
  if (!isScheduled) return undefined;
  return {
    id: "",
    date: willBeAddedDate,
    isDone: false,
  };
};
