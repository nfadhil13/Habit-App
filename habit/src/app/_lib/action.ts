"use server";
import ToggleHabitModel from "@/models/habit/ToogleHabit";
import HabitService from "@/services/habit_service";

export async function fetchHabitByDayAction(date: number) {
  return await HabitService.getHabitByDay(date);
}

export async function fetchAllHabitAction() {
  return await HabitService.getAllHabit();
}

export async function toggleHabitStatusAction({
  habitId,
  logId,
  isDone,
}: ToggleHabitModel) {
  return await HabitService.toggleDailyHabitStatus({
    habitId: habitId,
    isDone: isDone,
    logId: logId,
  });
}
