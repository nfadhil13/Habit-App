"use server";

import AllHabitList from "@/components/features/habit/AllHabit";
import HabitService from "@/services/habit_service";
import { fetchAllHabitAction } from "../action";
import Collapse from "@/components/infrasructure/layout/Collapse";

export default async function AllHabit() {
  const { daily, weekly } = await fetchAllHabitAction();
  return (
    <div className="card shadow-md">
      <Collapse header={`All Habit`}>
        <div className="text-md font-medium">Daily</div>
        <AllHabitList items={daily} />
        <div className="text-md  font-medium mt-4">Weekly</div>
        <AllHabitList items={weekly} />
      </Collapse>
    </div>
  );
}
