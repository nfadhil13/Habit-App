import Day from "@/models/day";
import NewHabitFormModel from "@/models/habit/NewHabit";
import TrackingType from "@/models/habit/TrackingType";
import { toStartOfUTC } from "@/utils/date_util";
import { Timestamp } from "firebase-admin/firestore";

const toFirestore = (formModel: NewHabitFormModel, id: string) => {
  const trackingType = formModel.trackingType;
  if (trackingType == null) throw "Tracking Type cannot be null";
  const { startDate } = formModel;
  const finalStartDate = toStartOfUTC(new Date(startDate ?? ""));
  const serverStartDate = Timestamp.fromMillis(finalStartDate.getTime());
  const scheduleOrWeeklyGoal =
    trackingType == TrackingType.daily
      ? {
          schedule: Array.from(formModel.schedule).map((value) => {
            return parseInt(Day[value]);
          }),
        }
      : {
          weeklyGoal:
            formModel.weeklyGoal != undefined
              ? parseInt(formModel.weeklyGoal.toString())
              : 0,
        };
  return {
    id: id,
    name: formModel.name,
    startDate: serverStartDate,
    trackingType: trackingType,
    currentStreak: 0,
    longestStreak: 0,
    ...scheduleOrWeeklyGoal,
  };
};

const NewHabitFirestoreMapper = {
  toFirestore,
};

export default NewHabitFirestoreMapper;
