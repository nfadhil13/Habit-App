import { initAdmin } from "@/utils/firebase/firebase_config";
import { FirestoreCollections } from "../../config";
import { Timestamp, getFirestore } from "firebase-admin/firestore";
import { toStartOfUTC } from "@/utils/date_util";
import TrackingType from "@/models/habit/TrackingType";
import TodayHabitModel from "@/models/habit/TodayHabit";
import HabitFirestoreMapper from "../mapper/habit_mapper";
import { HabitModel } from "@/models/habit/Habit";
import HabitLogFirestoreMapper from "../mapper/habit_log";
import moment from "moment";

export const getAllHabit = async (
  trackingType?: TrackingType
): Promise<HabitModel[]> => {
  const habitCollectionKey = FirestoreCollections.habit;
  await initAdmin();
  const db = getFirestore();
  const habitCollection = db.collection(habitCollectionKey.key);
  const { docs } =
    trackingType != null
      ? await habitCollection.where("trackingType", "==", trackingType).get()
      : await habitCollection.get();
  return docs.map((value) => HabitFirestoreMapper.fromFirestore(value));
};
