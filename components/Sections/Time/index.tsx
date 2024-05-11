"use client"

import FormUserInput from "@/components/FormUserInput"
import OptionBar from "@/components/Options/OptionBar"
import OptionRatio from "@/components/Options/OptionRatio"
import OptionTitleInputs from "@/components/Options/OptionTitleInputs"
import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { faClock } from "@fortawesome/free-regular-svg-icons"
import { memo, useEffect, useState } from "react"
import style from "./style.module.scss"

import NumberRange from "@/components/NumberRange"
import { useMainStore } from "@/store/main"
import { convertStrToTimeSet } from "@/utils/time"
import cs from "classNames/bind"
const cx = cs.bind(style)

function Time({ section }: { section: SectionType }) {
  const { t } = useTranslation()
  const {
    setModal,
    time: { selectedStartTime, selectedEndTime },
  } = useMainStore()
  const { setOptions, addCollection, deleteCollection } = useEditorStore()
  const { startHour, endHour, isAlways, specificTime, isRangeSelect } = section.options

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
    if (isRangeSelect) {
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
              specificEndTime: isRangeSelect ? endTimeResult : undefined,
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
    setModal({ type: "time", section })
  }

  useEffect(() => {
    if (isAlways) {
      setOptions({ key: "startHour", payload: "00" })
      setOptions({ key: "endHour", payload: "00" })
    }
  }, [isAlways])

  return (
    <div className={cx("layout")}>
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

      <div className={cx("options")}>
        <OptionTitleInputs section={section} />
        <div className={cx("time-bars")}>
          <h4>
            <span>{t("세부 설정")}</span>
          </h4>
          <OptionBar section={section} value="specificTime" />
          {specificTime && (
            <>
              <div className={cx("specific-time-picker")}>
                <div className={cx("inner")}>
                  <input
                    onChange={(e) => onChangeSpecificTime(e, "specificStartTime")}
                    value={tempStartTime}
                    type="time"
                  />
                  {isRangeSelect && (
                    <>
                      <span>{"~"}</span>
                      <input
                        onChange={(e) => onChangeSpecificTime(e, "specificEndTime")}
                        value={tempEndTime}
                        type="time"
                      />
                    </>
                  )}
                </div>
                <div className={cx("time-submit")}>
                  <button onClick={onSubmitSpecificTime} className={cx("time-submit")}>
                    <span> {t("addTime")}</span>
                  </button>
                </div>
              </div>
              <ul className={cx("times")}>
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
          <OptionBar section={section} value="isRangeSelect" />
          <OptionBar section={section} value="addAnytime" />
          {!specificTime && (
            <>
              <OptionBar section={section} value="isAlways" />
              {!isAlways && (
                <div className={cx("option-time-picker")}>
                  <div key={`time-min-max-startHour`} className={cx("time-min-max")}>
                    <input onChange={(e) => onChangeMinMaxHour(e, "startHour")} value={`${startHour}:00`} type="time" />
                  </div>
                  <span>{"~"}</span>
                  <div key={`time-min-max-endHour`} className={cx("time-min-max")}>
                    <input onChange={(e) => onChangeMinMaxHour(e, "endHour")} value={`${endHour}:00`} type="time" />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        {!specificTime && <OptionRatio optionsArr={[1, 15, 30, 60]} section={section} targetKey="interval" />}
      </div>
    </div>
  )
}

export default memo(Time)
