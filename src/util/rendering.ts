import { TimeUnit } from "@/interfaces";

export const formatTimeUnit = (timeUnit: TimeUnit) => {
  switch (timeUnit) {
    case TimeUnit.DAY:
      return "day";
    case TimeUnit.WEEK:
      return "week";
    case TimeUnit.MONTH:
      return "month";
    case TimeUnit.YEAR:
      return "year";
  }
};
