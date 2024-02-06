"use client";

import { DayPicker, Matcher } from "react-day-picker";
import TextField from "./TextField";
import React from "react";
import "react-day-picker/dist/style.css";
import moment from "moment";
import { toStartOfUTC } from "@/utils/date_util";

type DatePickerProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "type"
> & {
  value?: Date;
  label?: string;
  error?: string;
  maxDate?: Date;
  minDate?: Date;
  onChange: (date?: Date) => void;
  format?: string;
};

export default function DatePickerField({
  onChange,
  value,
  format = "YYYY-MM-DD",
  maxDate,
  minDate,
  ...props
}: DatePickerProps) {
  const showModal = () => {
    const docs = document.getElementById("calendar_modal");
    (docs as HTMLDialogElement).showModal();
  };

  const onDateSelected = (date?: Date) => {
    const docs = document.getElementById("calendar_modal");
    (docs as HTMLDialogElement).close();

    onChange(date != undefined ? toStartOfUTC(date, true) : undefined);
  };

  const disabledDays = (): Matcher[] | undefined => {
    if (!maxDate && !minDate) return undefined;

    let matcher: Matcher | undefined = [];

    if (minDate) {
      matcher = {
        before: minDate,
      };
    }
    if (maxDate) {
      matcher = {
        ...matcher,
        after: maxDate,
      };
    }
    return [matcher];
  };

  return (
    <div>
      <dialog id="calendar_modal" className="modal">
        <div className="modal-box w-fit">
          <DayPicker
            mode="single"
            ISOWeek={true}
            selected={value}
            today={new Date()}
            onSelect={onDateSelected}
            className="w-full"
            disabled={disabledDays()}
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <TextField
        {...props}
        onClick={showModal}
        value={moment(value).format(format)}
        onChange={() => {}}
      />
    </div>
  );
}
