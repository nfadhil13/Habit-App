import { HabitModel } from "@/models/habit/Habit";
import HabitItem from "./item/Habit";

type AllHabitListProps = {
  items: HabitModel[];
};
export default function AllHabitList({ items }: AllHabitListProps) {
  return (
    <>
      {items.map((value, index) => (
        <div key={value.id} className="mt-5  py-2 border-b-slate-400">
          <HabitItem habit={value} viewOnly={true} />
        </div>
      ))}
    </>
  );
}
