import { Timestamp } from "firebase-admin/firestore";
import HabitLogModel from "../../../types/habit/HabitLog";
import { toStartOfUTC } from "../../../utils/date_util";

const toFirestore = (formModel: HabitLogModel, id: string) => {
  const utcStartDate = toStartOfUTC(formModel.date);
  const serverStartDate = Timestamp.fromDate(utcStartDate);
  return {
    id: id,
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
