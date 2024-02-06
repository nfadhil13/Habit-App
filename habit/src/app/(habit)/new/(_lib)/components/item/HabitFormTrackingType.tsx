"use client";

import DropdownField from "@/components/infrasructure/form/Dropdown";
import useFormikField from "@/hooks/useFormikField";
import NewHabitFormModel, { NewHabitModelKeys } from "@/models/habit/NewHabit";
import TrackingType, { TrackingTypeHelper } from "@/models/habit/TrackingType";
import { useFormikContext } from "formik";
import DailyHabitField from "./DailyHabitField";
import WeeklyHabitField from "./WeeklyHabitField";

export default function HabitFormTrackingType() {
  const { value, error } = useFormikField<TrackingType | undefined>(
    NewHabitModelKeys.trackingType
  );

  const [trackingType] = value;

  const { values, handleChange } = useFormikContext<NewHabitFormModel>();

  return (
    <div>
      <DropdownField
        hint="Choose Your Tracking Type"
        value={values?.trackingType}
        error={error}
        name={NewHabitModelKeys.trackingType}
        label="Tracking Type"
        onChange={handleChange}
        options={TrackingTypeHelper.values.map((trackType) => {
          return {
            key: trackType,
            value: trackType,
            label: trackType,
          };
        })}
      />
      {trackingType == TrackingType.daily && <DailyHabitField />}
      {trackingType == TrackingType.weekly && <WeeklyHabitField />}
    </div>
  );
}
