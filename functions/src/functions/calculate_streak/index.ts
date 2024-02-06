import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { log } from "firebase-functions/logger";
import { getFirestore } from "firebase-admin/firestore";
import { FirestoreCollections } from "../../utils/firebase/colletion";
import PromisePool from "@supercharge/promise-pool";
import { getCurrentHabit } from "./util";
import { calculateCurrentStreak } from "./calculate_current_streak";
import { calculateLongestStreak } from "./calculate_longest_streak";
const habitCollection = FirestoreCollections.habit.key;
const logCollection = FirestoreCollections.habit.subCollections.log.key;

export const updateStreakListener = () =>
  onDocumentWritten(`${habitCollection}/{habitId}/${logCollection}/{logId}`, async (event) => {
    const { habitId } = event.params;
    log("RECEIVCE HABIT ID " + habitId);
    updateStreak(habitId);
  });

const updateStreak = async (habitId: string) => {
  const currentHabit = await getCurrentHabit(habitId);
  log("GOT CURRENT HABIT " + currentHabit?.habitName);
  if (currentHabit == undefined) return;
  // Calculting Longest Streak and Current Streak
  const { results, errors } = await PromisePool.for([
    () => calculateCurrentStreak(currentHabit),
    () => calculateLongestStreak(currentHabit),
  ]).process(async (callback) => await callback());
  log("PROCESSING RESULT OF " + results.length + " Error is" + errors);
  await updateCurrentHabitStreak(
    habitId,
    results[0] ?? currentHabit?.currentStreak,
    results[1] ?? currentHabit?.longestStreak,
  );
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
