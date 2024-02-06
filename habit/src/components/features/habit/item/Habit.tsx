import TrackingType from "@/models/habit/TrackingType";
import DailyHabitItem from "./DailyHabit";
import WeeklyHabitItem from "./WeeklyHabit";
import TodayHabitModel from "@/models/habit/TodayHabit";
import { DailyHabitModel, WeeklyHabitModel } from "@/models/habit/Habit";
import { HabitItemAction } from "./HabitWrapper";

type HabitItemProps = TodayHabitModel & {
  viewOnly: boolean;
  onActionClicked?: (model: TodayHabitModel, action: HabitItemAction) => void;
};

export default function HabitItem({
  habit,
  todayLog,
  weekLog = [],
  onActionClicked,
  viewOnly = false,
}: HabitItemProps) {
  switch (habit.trackingType) {
    case TrackingType.daily:
      return (
        <DailyHabitItem
          habit={habit as DailyHabitModel}
          viewOnly={viewOnly}
          onActionClicked={onActionClicked}
          todayLog={todayLog}
          weekLog={weekLog}
        />
      );
    case TrackingType.weekly:
      return (
        <WeeklyHabitItem
          habit={habit as WeeklyHabitModel}
          viewOnly={viewOnly}
          weekLog={weekLog}
          onActionClicked={onActionClicked}
          todayLog={todayLog}
        />
      );
  }
}
