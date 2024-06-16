const meridiemArr = ["12", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11"]

export function generateSecondSlots({ interval, min = 0 }: { interval: number; min?: number }): string[] {
  const max = 60
  const timeSlots: string[] = []

  for (let minute = min; minute < max; minute += interval) {
    timeSlots.push(minute.toString().padStart(2, "0"))
  }
  return timeSlots
}

export function generateHourSlots({ startHour = 0, endHour = 0 }: { startHour?: number; endHour?: number }): {
  amArr: string[]
  pmArr: string[]
} {
  if (startHour === 0 && endHour === 0) {
    return {
      amArr: meridiemArr,
      pmArr: meridiemArr,
    }
  }

  // const isDeleteFirst = intervalArr.filter((int) => startHour[1] <= int).length <= 0

  const amArr = []
  const pmArr = []
  for (let hour = startHour; hour <= endHour; hour++) {
    if (hour > 11) {
      // PM
      if (hour === 12) {
        pmArr.push("12")
      } else {
        pmArr.push((hour % 12).toString().padStart(2, "0"))
      }
    } else {
      // AM
      if (hour === 0) {
        amArr.push("12")
      } else {
        amArr.push(hour.toString().padStart(2, "0"))
      }
    }
  }

  return { amArr, pmArr }
}

export function get24hoursFromTime(str: string) {
  // '10:15 PM'
  const temp = str.replace(/\s/g, ":")
  const [h, s, me] = temp.split(":")

  const ch = h === "12" && me === "AM" ? 0 : h === "12" && me === "PM" ? 12 : parseInt(h) + (me === "PM" ? 12 : 0)
  return parseInt(`${ch}${s}`)
}

export function isMoreLateTime(str1: string, str2: string) {
  // '10:15 PM'

  return get24hoursFromTime(str1) > get24hoursFromTime(str2)
}

export const convertStrToTimeSet = (str: string) => {
  const [hour, minute] = str.split(":").map(Number)

  let period = "AM"
  let hour12 = hour

  if (hour >= 12) {
    period = "PM"
    hour12 = hour === 12 ? 12 : hour - 12
  } else if (hour === 0) {
    hour12 = 12
  }

  return `${hour12.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} ${period}`
}
