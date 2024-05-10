"use client"

import NumberRange from "@/components/NumberRange"
import { useTranslation } from "@/i18n/client"
import { generateHourSlots, generateSecondSlots, isMoreLateTime } from "@/utils/time"
import { useMemo, useState } from "react"
import ModalLayout from ".."
import style from "./style.module.scss"

import { useMainStore } from "@/store/main"
import { SectionType } from "@/types/Edit"
import cs from "classNames/bind"
const cx = cs.bind(style)

export const TimePicker = ({ section }: { section: SectionType }) => {
  const { t } = useTranslation()
  const { setModal, setTime } = useMainStore()
  const [selectedMeridiem, setSelectedMeridiem] = useState<null | string>(null)
  const [selectedHour, setSelectedHour] = useState<null | string>(null)
  const [startTime, setStartTime] = useState<null | string>(null)
  const [step, setStep] = useState("startTime")
  const { startHour: _startHour, endHour: _endHour, interval, specificTime, selectRange, addAnytime } = section.options
  const [startHour, endHour] = useMemo(() => {
    const s = parseInt(_startHour ?? "00")
    const e = parseInt(_endHour ?? "00")

    if (e > s) {
      return [s, e]
    } else {
      return [e, s]
    }
  }, [_startHour, _endHour])

  const close = () => setModal({ section: null, type: null })

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
            setTime({
              payload: {
                selectedStartTime: calcValue,
                selectedEndTime: startTime,
              },
            })
          } else {
            setTime({
              payload: {
                selectedStartTime: startTime,
                selectedEndTime: calcValue,
              },
            })
          }
          close()
        }
        if (selectRange === "single") {
          // 하나의 시간만 선택함으로 분단위 까지 선택하면 모달 종료
          setTime({
            payload: {
              selectedStartTime: calcValue,
              selectedEndTime: null,
            },
          })
          close()
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
        setTime({
          payload: {
            selectedStartTime: value.specificStartTime,
            selectedEndTime: value.specificEndTime, // undefined 도 가능
          },
        })
        close()
        break
      case "any":
        setTime({
          payload: {
            selectedStartTime: "anytime",
            selectedEndTime: null,
          },
        })
        close()
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
    <ModalLayout modalStyle={cx(style.time)}>
      {!specificTime && (
        <>
          <div className={cx("basic-time-list")}>
            <ul className={cx("meridiem")}>
              {amArr?.length > 0 && (
                <li className={cx({ selected: "am" === selectedMeridiem })}>
                  <button onClick={() => onClickTime("meridiem", "am")}>AM</button>
                </li>
              )}
              {pmArr?.length > 0 && (
                <li className={cx({ selected: "pm" === selectedMeridiem })}>
                  <button onClick={() => onClickTime("meridiem", "pm")}>PM</button>
                </li>
              )}
            </ul>
            <ul className={cx("hours", { disabled: !selectedMeridiem })}>
              {displayHours.map((v) => (
                <li className={cx({ selected: v === selectedHour })} key={`hours-${v}`}>
                  <button disabled={!selectedMeridiem} onClick={() => onClickTime("hour", v)}>
                    {v}
                  </button>
                </li>
              ))}
            </ul>
            <ul className={cx("seconds", { disabled: !selectedHour })}>
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
        <ul className={cx("select-time-list")}>
          {section.collection?.map(({ specificStartTime, specificEndTime }, i) => (
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
        <div className={cx("result-wrapper")}>
          {startTime && (
            <div className={cx("selected")}>
              <span>
                {startTime} {" ~ "}
              </span>
            </div>
          )}
          {!startTime && addAnytime && (
            <button className={cx("anytime")} onClick={() => onClickTime("any", "anytime")}>
              <span>{t("아무때나")}</span>
            </button>
          )}
        </div>
      )}
    </ModalLayout>
  )
}

export default TimePicker
