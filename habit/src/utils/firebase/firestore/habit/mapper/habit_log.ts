import HabitLogModel from "@/models/habit/HabitLog";
import TrackingType from "@/models/habit/TrackingType";
import { toStartOfDay, toStartOfUTC } from "@/utils/date_util";

import { Timestamp } from "firebase-admin/firestore";

const toFirestore = (formModel: HabitLogModel) => {
  const utcStartDate = toStartOfUTC(formModel.date);
  const serverStartDate = Timestamp.fromDate(utcStartDate);
  return {
    id: formModel.id,
    date: serverStartDate,
    isDone: formModel.isDone,
  };
};

const fromFireStore = (data: FirebaseFirestore.DocumentData): HabitLogModel => {
  return {
    id: data.get("id"),
    date: (data.get("date") as Timestamp).toDate(),
    isDone: data.get("isDone"),
  };
};

const HabitLogFirestoreMapper = {
  toFirestore,
  fromFireStore,
};

export default HabitLogFirestoreMapper;
