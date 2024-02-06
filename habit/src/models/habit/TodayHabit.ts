import { DailyHabitModel, HabitModel, WeeklyHabitModel } from "./Habit";
import HabitLogModel from "./HabitLog";

interface TodayHabitModel<T extends HabitModel = HabitModel> {
  habit: T extends DailyHabitModel
    ? DailyHabitModel
    : T extends WeeklyHabitModel
    ? WeeklyHabitModel
    : HabitModel;
  weekLog?: HabitLogModel[];
  todayLog?: HabitLogModel;
}

export type AllTodayHabitModel = TodayHabitModel<HabitModel>;
export type DailyTodayHabitModel = TodayHabitModel<DailyHabitModel>;
export type WeeklyTodayHabitModel = TodayHabitModel<WeeklyHabitModel>;
export default TodayHabitModel;
