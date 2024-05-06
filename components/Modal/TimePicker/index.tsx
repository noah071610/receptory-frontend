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
  const { setData, setActive, selectedSection, setValue } = useEditorStore()
  const [selectedMeridiem, setSelectedMeridiem] = useState<null | string>(null)
  const [selectedHour, setSelectedHour] = useState<null | string>(null)
  const [startTime, setStartTime] = useState<null | string>(null)
  const [step, setStep] = useState("startTime")
  const {
    startHour: _startHour,
    endHour: _endHour,
    interval,
    specificTime,
    selectRange,
    addAnytime,
  } = selectedSection?.options ?? {}
  const [startHour, endHour] = useMemo(() => {
    const s = parseInt(_startHour ?? "00")
    const e = parseInt(_endHour ?? "00")

    if (e > s) {
      return [s, e]
    } else {
      return [e, s]
    }
  }, [_startHour, _endHour])

  const onClickTime = (type: "hour" | "minute" | "meridiem" | "any" | "select", value: any) => {
    switch (type) {
      case "meridiem":
        setSelectedMeridiem(value)
        break
      case "hour":
        setSelectedHour(value)
        break
      case "minute":
        // 여기의 value는 minute 입니다아
        if (step === "endTime") {
          // 이거는 selectRange가 range여야만 도달할 수 있는 곳임!!
          setValue({
            payload: {
              selectedStarTime: startTime, // 저장 값 넣기
              selectedEnTime: `${selectedHour}:${value} ${selectedMeridiem?.toUpperCase()}`,
            },
          })
          setActive({ key: "all", payload: { type: null } })
        }
        if (selectRange === "single") {
          // 하나의 시간만 선택함으로 분단위 까지 선택하면 모달 종료
          setValue({
            payload: {
              selectedStarTime: `${selectedHour}:${value} ${selectedMeridiem?.toUpperCase()}`,
              selectedEnTime: undefined,
            },
          })
          setActive({ key: "all", payload: { type: null } })
        } else {
          setStartTime(`${selectedHour}:${value} ${selectedMeridiem?.toUpperCase()}`)
          setStep("endTime")
        }
        break
      case "select": // 리스트에 추가한 특정 시간을 선택
        // 이 로직은 따로 빼는게 좋지만... 그냥 사용하기로 했다 ㅠㅠ 귀찮아
        // 덕분에 value가 any가 되어버림요
        setValue({
          payload: {
            selectedStarTime: value.specificStartTime,
            selectedEnTime: value.specificEndTime, // undefined 도 가능
          },
        })
        setActive({ key: "all", payload: { type: null } })
        break
      case "any":
        setValue({
          payload: {
            selectedStartDate: "anytime",
            selectedEndDate: undefined,
          },
        })
        setActive({ key: "all", payload: { type: null } })
        break

      default:
        alert("에러 발생") //todo:
        break
    }
  }

  const { amArr, pmArr } = generateHourSlots({ startHour, endHour })
  const seconds = generateSecondSlots({
    interval,
  })

  return (
    selectedSection && (
      <ModalLayout modalStyle={cx(style.time)}>
        {!specificTime && (
          <>
            <div className={cx(style["basic-time-list"])}>
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
                {seconds.map((v) => (
                  <li key={`second-${v}`}>
                    <button disabled={!selectedHour} onClick={() => onClickTime("minute", v)}>
                      {v}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
        {specificTime && (
          <ul className={cx(style["select-time-list"])}>
            {selectedSection.collection.map(({ specificStartTime, specificEndTime }, i) => (
              <li key={`time_${i}`}>
                <button onClick={() => onClickTime("select", { specificStartTime, specificEndTime })}>
                  <span>{specificStartTime}</span>
                  {specificEndTime && <span>{" ~ "}</span>}
                  {specificEndTime && <span>{specificEndTime}</span>}
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className={cx(style["result-wrapper"])}>
          {startTime && (
            <div className={cx(style.selected)}>
              <span>{startTime}</span>
            </div>
          )}
          {addAnytime && (
            <button onClick={() => onClickTime("any", "anytime")}>
              <span>{t("아무때나")}</span>
            </button>
          )}
        </div>
      </ModalLayout>
    )
  )
}

export default TimePicker
