/// Use ISO WEEKDAY
enum Day {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 7,
}

function isDay(day: Day | String): day is Day {
  try {
    const parseResult = parseInt(day.toString()) || 0;
    return parseResult == 0;
  } catch {
    return true;
  }
}

const createDaily = (value: number): Day => {
  if (Object.values(Day).some((trackingType) => trackingType === value)) {
    return <Day>value;
  }
  throw "Unknown Daily";
};

const values = Object.values(Day)
  .filter((value) => isDay(value))
  .map((value) => value as Day);

export const DayEnumHelper = {
  values,
  createDaily,
};

export default Day;
