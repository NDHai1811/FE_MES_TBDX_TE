import dayjs from "dayjs";
import { COMMON_DATE_FORMAT } from "./constants";

export const formatDateTime = (date, dateFormatType = COMMON_DATE_FORMAT) => {
  if (!date) {
    return null;
  }
  if (date <= 0) {
    return "--";
  }
  return dayjs(date).format(dateFormatType);
};
