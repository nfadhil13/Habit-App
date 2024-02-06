"use server";
import NewHabitFormModel from "@/models/habit/NewHabit";
import HabitService from "@/services/habit_service";

export async function createHabitAction(data: NewHabitFormModel) {
  return await HabitService.createNewHabit(data);
}

