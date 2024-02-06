import moment from "moment";

type DaysBeforeParams = {
  date?: Date;
  days: number;
};

export const startAndEndOfWeek = (
  date: Date
): {
  monday: Date;
  sunday: Date;
} => {
  const selectedDate = moment(date);
  return {
    monday: selectedDate.startOf("isoWeek").toDate(),
    sunday: selectedDate.endOf("isoWeek").toDate(),
  };
};

export const toStartOfDay = (date: Date): Date => {
  return moment(new Date(date)).startOf("day").toDate();
};

export const toStartOfUTC = (date: Date, keepTime?: boolean): Date => {
  return moment(new Date(date)).utc(keepTime).startOf("day").toDate();
};

export const daysBeforeDate = ({ days, date }: DaysBeforeParams): Date => {
  return moment(date && new Date(date ?? ""))
    .subtract(days, "days")
    .toDate();
};

export const daysAfterDate = ({ days, date }: DaysBeforeParams): Date => {
  return moment(date && new Date(date))
    .add(days, "days")
    .toDate();
};

const DateUtils = {
  daysBeforeDate,
  daysAfterDate,
  toStartOfUTC,
  toStartOfDay,
  startAndEndOfWeek,
};

export default DateUtils;
