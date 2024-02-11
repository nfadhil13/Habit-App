import { log } from "firebase-functions/logger";
import { getFirestore } from "firebase-admin/firestore";
import { FirestoreCollections } from "../../utils/firebase/colletion";
import PromisePool from "@supercharge/promise-pool";
import { getCurrentHabit } from "./util";
import { calculateCurrentStreak } from "./calculate_current_streak";
import { calculateLongestStreak } from "./calculate_longest_streak";
import { HttpsError, onCall } from "firebase-functions/v2/https";
const habitCollection = FirestoreCollections.habit.key;

export const updateStreakRequest = () =>
  onCall(
    {
      region: "europe-west1",
    },
    async (req) => {
      try {
        const { habitId } = req.data;
        return await updateStreak(habitId);
      } catch (e) {
        if (e instanceof HttpsError) throw e;
        throw new HttpsError("unknown", "Unknown Error");
      }
    },
  );

export const updateStreak = async (habitId: string) => {
  const currentHabit = await getCurrentHabit(habitId);
  log("GOT CURRENT HABIT " + currentHabit?.habitName);
  if (currentHabit == undefined) {
    throw new HttpsError("not-found", "Habit with specified Id not found");
  }
  // Calculting Longest Streak and Current Streak
  const { results, errors } = await PromisePool.for([
    () => calculateCurrentStreak(currentHabit),
    () => calculateLongestStreak(currentHabit),
  ]).process(async (callback) => await callback());
  if (errors.length >= 1) throw new HttpsError("unknown", errors[0].message);
  const currentStreak = results[0] ?? currentHabit?.currentStreak;
  const longestStreak = results[1] ?? currentHabit?.longestStreak;
  await updateCurrentHabitStreak(habitId, currentStreak, longestStreak);
  return { currentStreak, longestStreak };
};
const updateCurrentHabitStreak = async (
  habitId: string,
  currentStreak: number,
  longestStreak: number,
) => {
  const firestore = getFirestore();
  await firestore.doc(`${habitCollection}/${habitId}`).update({
    currentStreak,
    longestStreak,
  });
};
