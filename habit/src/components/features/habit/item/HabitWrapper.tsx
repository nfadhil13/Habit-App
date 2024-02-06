import { HabitModel } from "@/models/habit/Habit";
import TodayHabitModel from "@/models/habit/TodayHabit";
import TrackingType from "@/models/habit/TrackingType";

export type HabitItemAction = "done" | "undo" | "more";

type HabitWrapperProps = TodayHabitModel & {
  subtitle?: string;
  viewOnly: boolean;
  isDone?: boolean;
  onActionClicked?: (model: TodayHabitModel, action: HabitItemAction) => void;
};

export default function HabitWrapper({
  habit,
  subtitle,
  todayLog,
  weekLog,
  isDone = false,
  onActionClicked,
  viewOnly = false,
}: HabitWrapperProps) {
  const onButtonClicked = (action: HabitItemAction) =>
    onActionClicked?.(
      {
        habit,
        todayLog,
        weekLog,
      },
      action
    );

  const avatarClass =
    "w-8 h-8 rounded-full flex justify-center items-center text-white ";
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div
          className={`${avatarClass} ${
            habit.trackingType == TrackingType.daily
              ? "bg-red-500"
              : "bg-purple-500"
          }`}
        >
          {habit.habitName[0].toUpperCase()}
        </div>
        <div className="ml-3 ">
          <div
            className={
              "text-md font-semibold" + ` ${isDone ? "line-through" : ""}`
            }
          >
            {habit.habitName}
          </div>
          {subtitle && <div className="ml text-sm">{subtitle}</div>}
        </div>
      </div>

      <>
        {!viewOnly && !isDone && (
          <button
            className="btn btn-sm btn-primary text-white"
            onClick={() => onButtonClicked("done")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Done
          </button>
        )}
        {isDone && (
          <button
            className="btn btn-sm "
            onClick={() => onButtonClicked("undo")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" />
            </svg>
            Undo
          </button>
        )}
      </>
      <>
        {viewOnly && (
          <div className="flex">
            <div className="card shadow-lg px-2 py-3 bg-cyan-500 flex flex-col item-center justify-center  text-center text-white ">
              <div className="text-sm">{habit.currentStreak}</div>
              <div className="text-xs">Current</div>
            </div>
            <div className="card shadow-sm  px-2 py-3 flex bg-green-500 flex-col item-center justify-center  text-center ml-5   text-white">
              <div className="text-sm">{habit.longestStreak}</div>
              <div className="text-xs">Longest</div>
            </div>
          </div>
        )}
      </>
    </div>
  );
}
