"server side";

import { getFirestore, Firestore } from "firebase-admin/firestore";
import { initAdmin } from "../../../firebase_config";
import { FirestoreCollections } from "../../config";
import NewHabitFormModel from "@/models/habit/NewHabit";
import NewHabitFirestoreMapper from "../mapper/new_habit";
import TrackingType from "@/models/habit/TrackingType";
import HabitLogModel from "@/models/habit/HabitLog";
import Day from "@/models/day";
import moment, { Moment } from "moment";
import HabitLogFirestoreMapper from "../mapper/habit_log";

export const createNewHabit = async (newHabit: NewHabitFormModel) => {
  const habitCollection = FirestoreCollections.habit;
  await initAdmin();
  const db = getFirestore();
  const batch = db.batch();
  const habitRef = db.collection(habitCollection.key).doc();
  const id = habitRef.id;
  batch.create(habitRef, NewHabitFirestoreMapper.toFirestore(newHabit, id));
  const logRef = habitRef.collection(habitCollection.subCollections.log.key);
  const { trackingType, startDate, schedule } = newHabit;
  const scheduleList = Array.from(schedule).map((value) => {
    return parseInt(Day[value]);
  });

  const today = moment();
  const daysDifference = today.diff(moment(startDate), "days");

  const habitLog = createNewHabitListAfterNDay({
    dayAfterList: Array.from(
      { length: daysDifference + 2 },
      (_, index) => index - daysDifference - 1
    ),
    startDate: new Date(startDate ?? ""),
    additionalCheck:
      trackingType == TrackingType.daily
        ? (moment) => scheduleList.includes(moment.isoWeekday())
        : undefined,
  });
  habitLog.forEach((value) => {
    const doc = logRef.doc();
    const id = doc.id;
    batch.create(doc, {
      ...HabitLogFirestoreMapper.toFirestore(value),
      id: id,
    });
  });
  await batch.commit();
};

const createNewHabitListAfterNDay = ({
  dayAfterList,
  startDate,
  additionalCheck,
}: {
  startDate: Date;
  dayAfterList: number[];
  additionalCheck?: (newDate: Moment) => boolean;
}): HabitLogModel[] => {
  const logs: HabitLogModel[] = [];
  dayAfterList.forEach((value) => {
    const log = createHabitNDayAfterStart({
      startDate: startDate,
      dayAfter: value,
      additionalCheck: additionalCheck,
    });
    if (log != undefined) {
      logs.push(log);
    }
  });
  return logs;
};

const createHabitNDayAfterStart = ({
  dayAfter,
  startDate,
  additionalCheck,
}: {
  startDate: Date;
  dayAfter: number;
  additionalCheck?: (newDate: Moment) => boolean;
}): HabitLogModel | undefined => {
  const toBeAddedDate = moment().add(dayAfter, "days");
  const isToBeAddedSameOrAfterStart = toBeAddedDate.isSameOrAfter(
    startDate,
    "day"
  );
  const isAdditionalValid = additionalCheck?.(toBeAddedDate) ?? true;
  const shouldAdd = isToBeAddedSameOrAfterStart && isAdditionalValid;
  if (!shouldAdd) return undefined;
  return {
    id: "",
    date: toBeAddedDate.toDate(),
    isDone: false,
  };
};
