"use client"

import FormUserInput from "@/components/FormUserInput"
import NumberRange from "@/components/NumberRange"
import OptionBar from "@/components/Options/OptionBar"
import OptionRatio from "@/components/Options/OptionRatio"
import OptionTitleInputs from "@/components/Options/OptionTitleInputs"
import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { faClock } from "@fortawesome/free-regular-svg-icons"
import classNames from "classNames"
import { memo, useEffect, useState } from "react"
import style from "./style.module.scss"

const cx = classNames.bind(style)

const convertStrToTimeSet = (str: string) => {
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

function Time({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { t } = useTranslation()
  const { setOptions, selectedSection, setSelectedSection, setActive, addCollection, deleteCollection } =
    useEditorStore()
  const { startHour, endHour, isAlways, specificTime, selectRange } = section.options
  const { selectedStartTime, selectedEndTime } = section.value

  const [tempStartTime, setTempStartTime] = useState<string>("00:00")
  const [tempEndTime, setTempEndTime] = useState<string>("00:00")

  const onChangeMinMaxHour = (e: any, type: string) => {
    const onlyHour = e.target.value.split(":")[0]
    setOptions({ payload: onlyHour, key: type })
  }

  const onChangeSpecificTime = (e: any, type: "specificStartTime" | "specificEndTime") => {
    if (type === "specificStartTime") {
      setTempStartTime(e.target.value)
    } else {
      setTempEndTime(e.target.value)
    }
  }

  const onSubmitSpecificTime = () => {
    const startTimeResult = convertStrToTimeSet(tempStartTime)
    const endTimeResult = convertStrToTimeSet(tempEndTime)

    let isWrongTimeSet = false
    if (selectRange === "range") {
      const start = parseInt(tempStartTime.split(":").join(""))
      const end = parseInt(tempEndTime.split(":").join(""))
      if (start > end) {
        // 비정상적인 상황, 오후7시 부터 오후 4시까지 라는 값은 존재 안함.
        // 이경우 두 시간대의 위치를 바꿔주면 정상으로 처리한다.
        isWrongTimeSet = true
      }
    }

    // selectRange에 따라서 specificEndTime 유무가 갈림,
    // specificEndTime은 undefined 여도 상관 없음
    setTimeout(() => {
      addCollection({
        payload: isWrongTimeSet
          ? // 잘못된 값임으로 위치를 바꿔준다 range일때만 작동됨으로 조건은 빼주었다.
            {
              specificStartTime: endTimeResult,
              specificEndTime: startTimeResult,
            }
          : {
              specificStartTime: startTimeResult,
              specificEndTime: selectRange === "range" ? endTimeResult : undefined,
            },
      })
    }, 0)

    // 클릭으로 추가하기 때문에 편의를 위해 캘린더와 달리 리셋하지 않음
    // setTempStartTime("00:00")
    // setTempEndTime("00:00")
  }

  const onClickDeleteSelectTime = (i: number) => {
    setTimeout(() => {
      deleteCollection({ targetIndex: i })
    }, 0)
  }

  const onClickOpenModal = () => {
    setTimeout(() => {
      setActive({ key: "modal", payload: { type: "time" } })
    }, 0)
  }

  useEffect(() => {
    if (isAlways) {
      setOptions({ key: "startHour", payload: "00" })
      setOptions({ key: "endHour", payload: "00" })
    }
  }, [isAlways])

  return (
    <div className={cx(style["layout"])}>
      <FormUserInput
        icon={faClock}
        onClick={onClickOpenModal}
        title={section.data.title}
        description={section.data.description}
      >
        {!selectedStartTime && t("날짜 입력")}
        {!!selectedStartTime && <span>{selectedStartTime === "anytime" ? t("anytime") : selectedStartTime}</span>}
        {!!selectedEndTime && <span>{" ~ "}</span>}
        {!!selectedEndTime && <span>{selectedEndTime}</span>}
      </FormUserInput>

      {!isDisplayMode && (
        <div className={cx(style.options)}>
          <OptionTitleInputs section={section} />
          <OptionBar section={section} value="specificTime" />
          <OptionBar section={section} value="addAnytime" />
          <OptionRatio optionsArr={["single", "range"]} section={section} targetKey="selectRange" />
          {!specificTime && (
            <>
              <OptionBar section={section} value="isAlways" />
              {!isAlways &&
                ["startHour", "endHour"].map((v) => (
                  <div key={`time-min-max-${v}`} className={cx(style["time-min-max"])}>
                    <h4>{v}</h4>
                    <input
                      onChange={(e) => onChangeMinMaxHour(e, v)}
                      value={`${v === "startHour" ? startHour : endHour}:00`}
                      type="time"
                    />
                  </div>
                ))}
            </>
          )}
          {specificTime && (
            <>
              <div>
                <h4>{t("specificStartTime")}</h4>
                <input
                  onChange={(e) => onChangeSpecificTime(e, "specificStartTime")}
                  value={tempStartTime}
                  type="time"
                />
              </div>
              {selectRange === "range" && (
                <div>
                  <h4>{t("specificEndTime")}</h4>
                  <input onChange={(e) => onChangeSpecificTime(e, "specificEndTime")} value={tempEndTime} type="time" />
                </div>
              )}
              <div>
                <button onClick={onSubmitSpecificTime} className={cx(style["time-submit"])}>
                  {t("addTime")}
                </button>
              </div>
              <ul className={cx(style.times)}>
                {section.collection.map(({ specificStartTime, specificEndTime }, i) => (
                  <li key={`specific_time_${i}`}>
                    <button onClick={() => onClickDeleteSelectTime(i)}>
                      <NumberRange start={specificStartTime} end={specificEndTime} />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          {!specificTime && <OptionRatio optionsArr={[1, 15, 30, 60]} section={section} targetKey="interval" />}
        </div>
      )}
    </div>
  )
}

export default memo(Time)
