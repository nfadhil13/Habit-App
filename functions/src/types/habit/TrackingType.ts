enum TrackingType {
  daily = "DAILY",
  weekly = "WEEKLY",
}

const createTrackingType = (value: string): TrackingType | undefined => {
  if (
    Object.values(TrackingType).some(
      (trackingType: string) => trackingType === value
    )
  )
    return <TrackingType>value;
  else return undefined;
};

const values = [TrackingType.daily, TrackingType.weekly];

export const TrackingTypeHelper = {
  values,
  createTrackingType,
};

export default TrackingType;
