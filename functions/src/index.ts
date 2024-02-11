import { initializeApp } from "firebase-admin/app";
import { updateStreakRequest } from "./functions/calculate_streak";
import { todayTaskGenerator } from "./functions/today_task_generator";

initializeApp();

// Generate today task for user
exports.example = todayTaskGenerator();
// Update Streak everytime there is change to habit log
exports.updateStreak = updateStreakRequest();
