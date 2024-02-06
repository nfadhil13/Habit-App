"use server";

import HabitByDay from "./_lib/components/HabitByDay";
import HabitService from "@/services/habit_service";

import Link from "next/link";
import { fetchHabitByDayAction } from "./_lib/action";
import AllHabit from "./_lib/components/AllHabit";
import NavBar from "@/components/infrasructure/layout/NavBar";

export default async function HomePage() {
  return (
    <>
      <NavBar>
        <a className="btn btn-ghost text-xl p-0">MY HABIT</a>
        <Link
          href="/new"
          className="btn btn-sm btn-primary font-normal text-xs text-neutral-50 rounded-md  "
        >
          + NEW HABIT
        </Link>
      </NavBar>
      <div className="mt-4 px-4">
        <div className="text-lg font-bold">Daily Habits</div>
        <HabitByDay fetchData={fetchHabitByDayAction} />
      </div>
      <div className="h-px  bg-black  my-10 mx-5"></div>
      <div className="mt-4 px-4">
        <div className="text-lg font-bold">All Time Task</div>
        <AllHabit />
        <div className="mt-8" />
      </div>
    </>
  );
}
