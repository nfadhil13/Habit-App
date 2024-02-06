"use client";

import TextField from "@/components/infrasructure/form/TextField";
import NewHabitFormModel, { NewHabitModelKeys } from "@/models/habit/NewHabit";
import { Formik, FormikContext, useFormikContext } from "formik";
import HabitFormTrackingType from "./item/HabitFormTrackingType";
import TrackingType from "@/models/habit/TrackingType";
import { FormEvent, FormEventHandler } from "react";
import { useNewHabitForm } from "../useNewHabitForm";
import moment from "moment";
import DatePickerField from "@/components/infrasructure/form/DatePickerField";
import DateUtils from "@/utils/date_util";

export default function NewHabitForm() {
  const { formik, onSubmit, isFormLoading } = useNewHabitForm();

  const { values, errors, handleChange, setFieldValue } = formik;

  return (
    <FormikContext.Provider value={formik}>
      <form onSubmit={onSubmit}>
        <div className=" md:grid  md:grid-cols-2 md:gap-4">
          <TextField
            label="Name"
            type="text"
            error={errors.name}
            name={NewHabitModelKeys.name}
            value={values?.name}
            onChange={handleChange}
          />
          <DatePickerField
            label="Start Date"
            error={errors.startDate}
            name={NewHabitModelKeys.startDate}
            value={values.startDate}
            minDate={DateUtils.daysBeforeDate({
              days: 100,
            })}
            onChange={(value) =>
              setFieldValue(NewHabitModelKeys.startDate, value)
            }
          />
          <div className="md:col-span-2">
            <HabitFormTrackingType />
          </div>
        </div>
        <div className="mt-5 w-full flex justify-end">
          <button
            type={isFormLoading ? "button" : "submit"}
            className={`btn ${isFormLoading ? "btn-disabled" : "btn-primary"}`}
          >
            Submit
          </button>
        </div>
      </form>
    </FormikContext.Provider>
  );
}
