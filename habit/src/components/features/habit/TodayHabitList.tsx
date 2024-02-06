import { HabitModel } from "@/models/habit/Habit";
import HabitItem from "./item/Habit";
import TodayHabitModel from "@/models/habit/TodayHabit";
import { HabitItemAction } from "./item/HabitWrapper";

type TodayHabitListProps = {
  items: TodayHabitModel[];
  viewOnly: boolean;
  onActionClicked?: (model: TodayHabitModel, action: HabitItemAction) => void;
};
export default function TodayHabitList({
  items,
  onActionClicked,
}: TodayHabitListProps) {
  return (
    <>
      {items.map((value, index) => (
        <div key={value.habit.id} className={`${index == 0 ? "" : "mt-5"}`}>
          <HabitItem
            onActionClicked={onActionClicked}
            habit={value.habit}
            todayLog={value.todayLog}
            viewOnly={false}
            weekLog={value.weekLog}
          />
        </div>
      ))}
    </>
  );
}
