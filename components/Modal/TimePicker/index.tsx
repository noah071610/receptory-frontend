"use client"

import classNames from "classNames"

import NumberRange from "@/components/NumberRange"
import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { generateHourSlots, generateSecondSlots, isMoreLateTime } from "@/utils/time"
import { useMemo, useState } from "react"
import ModalLayout from ".."
import style from "./style.module.scss"

const cx = classNames.bind(style)

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

        const calcValue = `${selectedHour}:${value} ${selectedMeridiem?.toUpperCase()}`

        if (step === "endTime" && startTime) {
          // 이거는 selectRange가 range여야만 도달할 수 있는 곳임!!

          // 오후 5시 ~ 오후 3시를 같이 선택하면 바꿔준다.

          if (isMoreLateTime(startTime, calcValue)) {
            setValue({
              payload: {
                selectedStartTime: calcValue,
                selectedEndTime: startTime,
              },
            })
          } else {
            setValue({
              payload: {
                selectedStartTime: startTime,
                selectedEndTime: calcValue,
              },
            })
          }
          setActive({ key: "all", payload: { type: null } })
        }
        if (selectRange === "single") {
          // 하나의 시간만 선택함으로 분단위 까지 선택하면 모달 종료
          setValue({
            payload: {
              selectedStartTime: calcValue,
              selectedEndTime: undefined,
            },
          })
          setActive({ key: "all", payload: { type: null } })
        } else {
          // endTime 선택해야함 재선택 시작

          setStartTime(calcValue)
          setSelectedMeridiem(null)
          setSelectedHour(null)
          setStep("endTime")
        }
        break
      case "select": // 리스트에 추가한 특정 시간을 선택
        // 이 로직은 따로 빼는게 좋지만... 그냥 사용하기로 했다 ㅠㅠ 귀찮아
        // 덕분에 value가 any가 되어버림요
        setValue({
          payload: {
            selectedStartTime: value.specificStartTime,
            selectedEndTime: value.specificEndTime, // undefined 도 가능
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
  const displayHours = !selectedMeridiem
    ? amArr?.length > 0
      ? amArr
      : pmArr
    : selectedMeridiem === "pm"
      ? pmArr
      : amArr

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
                {displayHours.map((v) => (
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
                  <NumberRange start={specificStartTime} end={specificEndTime} />
                </button>
              </li>
            ))}
          </ul>
        )}
        {/* selectRange가 range 이거나 anytime 버튼이 있으면 display */}
        {(!!startTime || addAnytime) && (
          <div className={cx(style["result-wrapper"])}>
            {startTime && (
              <div className={cx(style.selected)}>
                <span>
                  {startTime} {" ~ "}
                </span>
              </div>
            )}
            {!startTime && addAnytime && (
              <button className={cx(style.anytime)} onClick={() => onClickTime("any", "anytime")}>
                <span>{t("아무때나")}</span>
              </button>
            )}
          </div>
        )}
      </ModalLayout>
    )
  )
}

export default TimePicker
