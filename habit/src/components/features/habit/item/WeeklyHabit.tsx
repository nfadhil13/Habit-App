import { WeeklyHabitModel } from "@/models/habit/Habit";
import TodayHabitModel, {
  WeeklyTodayHabitModel,
} from "@/models/habit/TodayHabit";
import HabitWrapper, { HabitItemAction } from "./HabitWrapper";

type WeeklyHabitItemProps = WeeklyTodayHabitModel & {
  viewOnly: boolean;
  onActionClicked?: (model: TodayHabitModel, action: HabitItemAction) => void;
};

export default function WeeklyHabitItem({
  habit,
  todayLog,
  viewOnly,
  onActionClicked,
  weekLog = [],
}: WeeklyHabitItemProps) {
  if (viewOnly || weekLog == undefined) {
    return (
      <HabitWrapper
        habit={habit}
        todayLog={todayLog}
        viewOnly={viewOnly}
        subtitle={`${habit.weeklyGoal} times a week `}
      />
    );
  }
  const doneThisWeek = weekLog.filter((value) => value.isDone).length;
  return (
    <HabitWrapper
      onActionClicked={onActionClicked}
      habit={habit}
      todayLog={todayLog}
      isDone={doneThisWeek == habit.weeklyGoal || todayLog?.isDone == true}
      subtitle={`${doneThisWeek}/${habit.weeklyGoal}`}
      viewOnly={viewOnly}
    />
  );
}
