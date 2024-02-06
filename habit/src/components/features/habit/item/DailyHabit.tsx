import Day from "@/models/day";
import {} from "@/models/habit/Habit";
import TodayHabitModel, {
  DailyTodayHabitModel,
} from "@/models/habit/TodayHabit";
import moment from "moment";
import HabitWrapper, { HabitItemAction } from "./HabitWrapper";

type DailyHabitItemProps = DailyTodayHabitModel & {
  viewOnly: boolean;
  onActionClicked?: (model: TodayHabitModel, action: HabitItemAction) => void;
};

// Can be refactored to craete one common component for both daily and weekly
export default function DailyHabitItem({
  habit,
  todayLog,
  weekLog = [],
  viewOnly,
  onActionClicked,
}: DailyHabitItemProps) {
  const transformToAbbreviatedDayNames = (dayEnum: Day) => {
    return moment().day(dayEnum).format("ddd");
  };

  // Transform the array
  const abbreviatedDayNamesArray = () =>
    habit.schedule
      .sort()
      .map((dayEnum) => {
        return transformToAbbreviatedDayNames(dayEnum);
      })
      .join(", ");

  return (
    <>
      <HabitWrapper
        habit={habit}
        onActionClicked={onActionClicked}
        todayLog={todayLog}
        isDone={todayLog?.isDone == true}
        viewOnly={viewOnly}
        subtitle={viewOnly ? abbreviatedDayNamesArray() : undefined}
      />
    </>
  );
}
