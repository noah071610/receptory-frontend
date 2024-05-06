import dayjs from "dayjs"

export default function setDate(date: Date) {
  return dayjs(date).format("DD/MM/YYYY")
}
