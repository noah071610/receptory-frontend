"use client"

import classNames from "classNames"

import { useEditorStore } from "@/store/editor"
import { getAnimation } from "@/utils/getAnimation"
import { useMemo, useState } from "react"
import style from "./style.module.scss"

const cx = classNames.bind(style)

const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))

function generateSecondSlots({
  interval,
  startTime = [0, 0],
  endTime = [23, 59],
  selectedHour,
}: {
  interval: number
  startTime?: number[]
  endTime?: number[]
  selectedHour: number | null
}): string[] {
  const min = 0
  const max = 60
  const timeSlots: string[] = []

  switch (true) {
    case selectedHour === startTime[0]: {
      for (let minute = min; minute < max; minute += interval) {
        if (minute < startTime[1]) continue
        timeSlots.push(minute.toString().padStart(2, "0"))
      }
      return timeSlots
    }
    case selectedHour === endTime[0]: {
      for (let minute = min; minute <= endTime[1]; minute += interval) {
        timeSlots.push(minute.toString().padStart(2, "0"))
      }
      return timeSlots
    }

    default: {
      for (let minute = min; minute < max; minute += interval) {
        timeSlots.push(minute.toString().padStart(2, "0"))
      }
      return timeSlots
    }
  }
}

function generateHourSlots({
  startTime = [0, 0],
  endTime = [23, 59],
  interval,
}: {
  startTime?: number[]
  endTime?: number[]
  interval: number
}): string[] {
  const temp = interval === 15 ? [0, 15, 30, 45] : interval === 30 ? [0, 30] : interval === 60 ? [0] : [99999]
  if (temp.filter((int) => startTime[1] <= int).length <= 0) {
    return hours.slice(startTime[0] + 1, endTime[0] + 1)
  }
  return hours.slice(startTime[0], endTime[0] + 1)
}

function getNumberFromTime(str: string) {
  return str.split(":").map((v) => parseInt(v))
}

export const TimePicker = () => {
  const { setOptions, setActive, selectedSection } = useEditorStore()
  const [selectedHour, setSelectedHour] = useState<null | string>(null)
  const interval = selectedSection?.options.interval
  const [_startTime, _endTime] = useMemo(
    () => [
      getNumberFromTime(selectedSection?.options.startTime ?? "00:00"),
      getNumberFromTime(selectedSection?.options.endTime ?? "23:59"),
    ],
    [selectedSection?.options.startTime, selectedSection?.options.endTime]
  )

  const [startTime, endTime] = useMemo(() => {
    if (parseInt(`${_startTime[0]}${_startTime[1]}`) > parseInt(`${_endTime[0]}${_endTime[1]}`)) {
      return [_endTime, _startTime]
    } else {
      return [_startTime, _endTime]
    }
  }, [_startTime, _endTime])

  const onClickTime = (type: "hour" | "minute", value: string) => {
    if (type === "hour") {
      setSelectedHour(value)
    } else {
      setOptions({ payload: `${selectedHour}:${value}`, key: "time" })
      setActive({ key: "all", payload: null })
    }
  }

  return (
    <div className={cx(style.overlay)}>
      <div id="editor" style={getAnimation("fadeUp", 0, 600)} className={cx(style.time)}>
        <ul className={cx(style.hours)}>
          {generateHourSlots({ startTime, endTime, interval }).map((v) => (
            <li className={cx({ [style.selected]: v === selectedHour })} key={`hours-${v}`}>
              <button onClick={() => onClickTime("hour", v)}>{v}</button>
            </li>
          ))}
        </ul>
        <ul className={cx(style.seconds, { [style.disabled]: !selectedHour })}>
          {generateSecondSlots({
            interval,
            startTime,
            endTime,
            selectedHour: parseInt(selectedHour ?? "00"),
          }).map((v) => (
            <li key={`second-${v}`}>
              <button disabled={!selectedHour} onClick={() => onClickTime("minute", v)}>
                {v}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TimePicker
