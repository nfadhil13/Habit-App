import useFormikField from "@/hooks/useFormikField";
import Day, { DayEnumHelper } from "@/models/day";
import { NewHabitModelKeys } from "@/models/habit/NewHabit";

export default function DailyHabitField() {
  const { value, error } = useFormikField<Set<Day> | undefined>(
    NewHabitModelKeys.schedule
  );

  const [selectedDays, setSelectedDay] = value;

  const onToggle = (toBeToogledDay: Day) => {
    const oldSelected = selectedDays;
    if (oldSelected == undefined) {
      setSelectedDay(new Set([toBeToogledDay]));
    }
    const newSelectedSet = new Set(oldSelected);
    const isSelected = newSelectedSet?.has(toBeToogledDay);
    if (isSelected == true) {
      newSelectedSet.delete(toBeToogledDay);
    } else {
      newSelectedSet.add(toBeToogledDay);
    }
    setSelectedDay(newSelectedSet);
  };

  const days = DayEnumHelper.values;

  return (
    <div className="flex flex-col justify-center mt-2">
      <label className="text-lg font-semibold text-center flex flex-col">
        Select Days{" "}
        {selectedDays != undefined && selectedDays.size != 0
          ? `(${selectedDays.size})`
          : ""}
        {error && (
          <span className="label-text-alt text-error font-normal">{error}</span>
        )}
      </label>

      <div className="flex flex-wrap flex-row flex-auto w-full gap-4 justify-center mt-4">
        {days.map((value) => {
          const isSelected =
            selectedDays != undefined ? selectedDays.has(value) : false;
          return (
            <div
              onClick={() => onToggle(value)}
              className={`btn ${isSelected ? "btn-secondary" : ""}`}
              key={value}
            >
              {value}
            </div>
          );
        })}
      </div>
    </div>
  );
}
