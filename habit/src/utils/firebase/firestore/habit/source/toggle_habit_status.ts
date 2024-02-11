import FirebaseConfig, { initAdmin } from "@/utils/firebase/firebase_config";
import { FirestoreCollections } from "../../config";
import { getFirestore } from "firebase-admin/firestore";
import {
  getFunctions,
  httpsCallable,
  httpsCallableFromURL,
} from "firebase/functions";

export const toogleDailyStatus = async ({
  habitId,
  isDone,
  logId,
}: {
  habitId: string;
  isDone: boolean;
  logId: string;
}) => {
  const habitCollectionKey = FirestoreCollections.habit;
  await initAdmin();
  console.log("START TOGGLE HABIT");
  const db = getFirestore();
  const logCollection = db
    .collection(habitCollectionKey.key)
    .doc(habitId)
    .collection(habitCollectionKey.subCollections.log.key);
  await logCollection.doc(logId).update({
    isDone: isDone,
  });
  const functions = getFunctions(FirebaseConfig.clientApp, "europe-west1");
  const updateStreak = httpsCallableFromURL(
    functions,
    "https://europe-west1-newu-assignment.cloudfunctions.net/updateStreak"
  );
  const result = await updateStreak({
    habitId: habitId,
  });
  console.log("RESULT " + result);
  console.log(result);
};
