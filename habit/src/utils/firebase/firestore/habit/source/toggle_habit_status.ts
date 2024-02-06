import { initAdmin } from "@/utils/firebase/firebase_config";
import { FirestoreCollections } from "../../config";
import { getFirestore } from "firebase-admin/firestore";
import HabitLogFirestoreMapper from "../mapper/habit_log";
import HabitFirestoreMapper from "../mapper/habit_mapper";
import DateUtils from "@/utils/date_util";
import HabitLogModel from "@/models/habit/HabitLog";

export const toogleDailyStatus = async ({
  habitId,
  isDone,
  logId,
}: {
  habitId: string;
  isDone: boolean;
  logId: string;
}) => {
  const habitCollectionKey = FirestoreCollections.habit;
  await initAdmin();
  const db = getFirestore();
  const logCollection = db
    .collection(habitCollectionKey.key)
    .doc(habitId)
    .collection(habitCollectionKey.subCollections.log.key)
    .doc(logId);
  await logCollection.update({
    isDone: isDone,
  });
};
