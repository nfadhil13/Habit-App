import DropdownField from "@/components/infrasructure/form/Dropdown";
import NewHabitFormModel, { NewHabitModelKeys } from "@/models/habit/NewHabit";
import { useFormikContext } from "formik";

const weeklyGoal = [1, 2, 3, 4, 5, 6, 7];

export default function WeeklyHabitField() {
  const { values, handleChange, errors } =
    useFormikContext<NewHabitFormModel>();

  return (
    <DropdownField
      value={values?.weeklyGoal}
      name={NewHabitModelKeys.weeklyGoal}
      label="Tracking Type"
      error={errors.weeklyGoal}
      onChange={handleChange}
      hint="Choose you weekly goal"
      options={weeklyGoal.map((weeklyGoal) => {
        return {
          key: weeklyGoal,
          value: weeklyGoal,
          label: `${weeklyGoal} ${weeklyGoal == 1 ? "Time" : "Times"} a week`,
        };
      })}
    />
  );
}
