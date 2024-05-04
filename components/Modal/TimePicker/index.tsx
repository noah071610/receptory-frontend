"use client"

import classNames from "classNames"

import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { useMemo, useState } from "react"
import ModalLayout from ".."
import style from "./style.module.scss"

const cx = classNames.bind(style)

const meridiemArr = ["12", "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11"]

function generateSecondSlots({ interval }: { interval: number }): string[] {
  const min = 0
  const max = 60
  const timeSlots: string[] = []

  for (let minute = min; minute < max; minute += interval) {
    timeSlots.push(minute.toString().padStart(2, "0"))
  }
  return timeSlots
}

function generateHourSlots({ startHour = 0, endHour = 0 }: { startHour?: number; endHour?: number }): {
  [key: string]: string[]
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
      if (hour === 12) {
        pmArr.push("12")
      } else {
        pmArr.push((hour % 12).toString().padStart(2, "0"))
      }
    } else {
      if (hour === 0) {
        amArr.push("12")
      } else {
        amArr.push(hour.toString().padStart(2, "0"))
      }
    }
  }

  return { amArr, pmArr }
}

export const TimePicker = () => {
  const { t } = useTranslation()
  const { setData, setActive, selectedSection } = useEditorStore()
  const [selectedMeridiem, setSelectedMeridiem] = useState<null | string>(null)
  const [selectedHour, setSelectedHour] = useState<null | string>(null)
  const interval = selectedSection?.options.interval
  const [startHour, endHour] = useMemo(() => {
    const s = parseInt(selectedSection?.options.startHour ?? "00")
    const e = parseInt(selectedSection?.options.endHour ?? "00")

    if (e > s) {
      return [s, e]
    } else {
      return [e, s]
    }
  }, [selectedSection?.options.startHour, selectedSection?.options.endHour])

  const onClickTime = (type: "hour" | "minute" | "meridiem" | "any" | "select", value: string) => {
    switch (type) {
      case "meridiem":
        setSelectedMeridiem(value)
        return
      case "hour":
        setSelectedHour(value)
        return
      case "minute":
        setData({ payload: `${selectedHour}:${value} ${selectedMeridiem?.toUpperCase()}`, key: "time" })
        break
      case "select":
        setData({ payload: value, key: "time" })
        break
      case "any":
        setData({ payload: "anytime", key: "time" })
        break

      default:
        alert("에러 발생") //todo:
        break
    }
    setActive({ key: "all", payload: { type: null } })
  }

  const { amArr, pmArr } = generateHourSlots({ startHour, endHour })

  return (
    selectedSection && (
      <ModalLayout modalStyle={cx(style.time, { [style.select]: selectedSection.design === "select" })}>
        {selectedSection.design === "basic" && (
          <>
            {" "}
            <div className={cx(style["basic-main"])}>
              <ul className={cx(style["meridiem"])}>
                {amArr?.length > 0 && (
                  <li className={cx({ [style.selected]: "am" === selectedMeridiem })}>
                    <button onClick={() => onClickTime("meridiem", "am")}>AM</button>
                  </li>
                )}
                {pmArr?.length > 0 && (
                  <li className={cx({ [style.selected]: "pm" === selectedMeridiem })}>
                    <button onClick={() => onClickTime("meridiem", "pm")}>PM</button>
                  </li>
                )}
              </ul>
              <ul className={cx(style.hours, { [style.disabled]: !selectedMeridiem })}>
                {(!selectedMeridiem ? meridiemArr : selectedMeridiem === "pm" ? pmArr : amArr)?.map((v) => (
                  <li className={cx({ [style.selected]: v === selectedHour })} key={`hours-${v}`}>
                    <button disabled={!selectedMeridiem} onClick={() => onClickTime("hour", v)}>
                      {v}
                    </button>
                  </li>
                ))}
              </ul>
              <ul className={cx(style.seconds, { [style.disabled]: !selectedHour })}>
                {generateSecondSlots({
                  interval,
                }).map((v) => (
                  <li key={`second-${v}`}>
                    <button disabled={!selectedHour} onClick={() => onClickTime("minute", v)}>
                      {v}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {selectedSection.options.addAnytime && selectedSection.design === "basic" && (
              <div className={cx(style["any-time"])}>
                <button onClick={() => onClickTime("any", "anytime")}>
                  <span>{t("아무때나")}</span>
                </button>
              </div>
            )}
          </>
        )}
        {selectedSection.design === "select" && (
          <ul className={cx(style["select-time-list"])}>
            {selectedSection.collection.map((v, i) => (
              <li key={`modal_${v}_${i}`}>
                <button onClick={() => onClickTime("select", v)}>{v}</button>
              </li>
            ))}
          </ul>
        )}
      </ModalLayout>
    )
  )
}

export default TimePicker
