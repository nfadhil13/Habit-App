import Day from "../day";
import TrackingType from "./TrackingType";

type NewHabitFormModel = {
  name?: string;
  startDate?: Date;
  trackingType?: TrackingType;
  schedule: Set<Day>;
  weeklyGoal?: number;
};

export const NewHabitModelKeys = {
  name: "name",
  startDate: "startDate",
  trackingType: "trackingType",
  schedule: "schedule",
  weeklyGoal: "weeklyGoal",
};

export default NewHabitFormModel;
