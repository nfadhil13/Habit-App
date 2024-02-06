"use client";
import TodayHabitList from "@/components/features/habit/TodayHabitList";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import moment from "moment";
import DatePickerField from "@/components/infrasructure/form/DatePickerField";
import TodayHabitModel from "@/models/habit/TodayHabit";
import Collapse from "@/components/infrasructure/layout/Collapse";
import { useToggleHabit } from "../use_toggle_habit";
import { HabitItemAction } from "@/components/features/habit/item/HabitWrapper";
import { useRouter } from "next/navigation";

type HabitByDayProps = {
  fetchData: (date: number) => Promise<{
    weekly: TodayHabitModel[];
    daily: TodayHabitModel[];
  }>;
};

export default function HabitByDay({ fetchData }: HabitByDayProps) {
  const [date, setDate] = useState(new Date());
  const router = useRouter();

  const { data, isLoading, isError, refetch } = useQuery({
    queryFn: () => {
      return fetchData(date.getTime());
    },
    queryKey: [date],
    gcTime: 0,
  });

  const { mutate } = useToggleHabit({
    onSuccess: () => {
      refetch();
      router.refresh();
    },
  });

  const onHabitAction = (
    todayHabit: TodayHabitModel,
    action: HabitItemAction
  ) => {
    const { habit, todayLog } = todayHabit;
    switch (action) {
      case "done":
      case "undo":
        if (todayLog == undefined) return;
        mutate({
          habitId: habit.id,
          isDone: action == "done",
          logId: todayLog.id,
        });
      default:
    }
  };

  const onDateChange = (date?: Date) => {
    if (date == undefined) return;
    setDate(date);
  };

  if (isLoading)
    return (
      <div>
        <div className="flex justify-center items-center mt-4">
          <span className="loading loading-bars loading-lg"></span>
        </div>
      </div>
    );
  if (isError || data == undefined) return <div>Error ..</div>;
  const { daily, weekly } = data;
  return (
    <div>
      <DatePickerField
        onChange={onDateChange}
        value={date}
        format="LL"
        minDate={moment().subtract(8, "months").toDate()}
        maxDate={moment().add(1, "days").toDate()}
      />
      <div className="card shadow-md">
        <Collapse header={`Daily Habit (${daily.length})`}>
          <TodayHabitList
            onActionClicked={onHabitAction}
            items={daily}
            viewOnly={false}
          />
        </Collapse>
      </div>
      <div className="card shadow-md mt-6">
        <Collapse header={`Weekly Habit (${weekly.length})`}>
          <TodayHabitList
            onActionClicked={onHabitAction}
            items={weekly}
            viewOnly={false}
          />
        </Collapse>
      </div>
    </div>
  );
}
