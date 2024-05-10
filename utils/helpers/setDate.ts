import dayjs from "dayjs"

export default function setDateFormat(date: Date) {
  return dayjs(date).format("DD/MM/YYYY")
}
