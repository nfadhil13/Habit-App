import { createNewHabit } from "./create_new_habit";
import { getAllHabit } from "./get_all";
import { getTodayHabitByDay } from "./get_habit_by_day";
import { toogleDailyStatus } from "./toggle_habit_status";

const FirestoreHabitDTS = {
  createNewHabit,
  getTodayHabitByDay,
  getAllHabit,
  toogleDailyStatus,
};

export default FirestoreHabitDTS;
