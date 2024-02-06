import moment = require("moment");

type DaysBeforeParams = {
  date?: Date;
  days: number;
};

export const startAndEndOfWeek = (
  date: Date,
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
  return moment(date).startOf("day").toDate();
};

export const toStartOfUTC = (date: Date): Date => {
  return moment(date).utc().startOf("day").toDate();
};

export const daysBeforeDate = ({ days, date }: DaysBeforeParams): Date => {
  return moment(date).subtract(days, "days").toDate();
};

export const daysAfterDate = ({ days, date }: DaysBeforeParams): Date => {
  return moment(date).add(days, "days").toDate();
};

export const isToday = (date: Date): boolean => {
  const today = moment().utc().startOf("day");
  return moment(date).utc().startOf("day").isSame(today);
};

const DateUtils = {
  daysBeforeDate,
  daysAfterDate,
  toStartOfUTC,
  toStartOfDay,
  startAndEndOfWeek,
};

export default DateUtils;
