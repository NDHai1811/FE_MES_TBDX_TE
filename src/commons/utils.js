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

export const generateUniqueKey = (prefix = 'key') => {
  const timestamp = new Date().getTime();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
}
