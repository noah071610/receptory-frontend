"use client"

import FormUserInput from "@/components/FormUserInput"
import OptionBar from "@/components/Options/OptionBar"
import OptionRatio from "@/components/Options/OptionRatio"
import OptionTitleInputs from "@/components/Options/OptionTitleInputs"
import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { faClock } from "@fortawesome/free-regular-svg-icons"
import classNames from "classNames"
import { memo, useCallback, useEffect, useState } from "react"
import style from "./style.module.scss"

const cx = classNames.bind(style)

function Time({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { t } = useTranslation()
  const { setOptions, selectedSection, setSelectedSection, setActive, addCollection, deleteCollection } =
    useEditorStore()
  const [timeForAdd, setTimeForAdd] = useState("00:00")
  const selectedTime = section.data?.time ?? t("시간 선택")
  const { startHour, endHour, isAlways, specificTime } = section.options

  const onChangeTime = (e: any, type: string) => {
    const onlyHour = e.target.value.split(":")[0]
    setOptions({ payload: onlyHour, key: type })
  }

  const onChangeTimeForAdd = (e: any) => {
    setTimeForAdd(e.target.value)
  }

  const onClickAddTime = useCallback(() => {
    const [hour, minute] = timeForAdd.split(":").map(Number)

    let period = "AM"
    let hour12 = hour

    if (hour >= 12) {
      period = "PM"
      hour12 = hour === 12 ? 12 : hour - 12
    } else if (hour === 0) {
      hour12 = 12
    }

    const result = `${hour12.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} ${period}`

    setTimeout(() => {
      addCollection({ payload: result })
    }, 0)
  }, [timeForAdd, selectedSection?.id, section.id])

  const onClickTimeSelect = () => {
    if (selectedSection?.id !== section.id) {
      setSelectedSection({ payload: section })
    }
    setActive({ key: "modal", payload: { type: "time" } })
  }

  const onClickDeleteSelectTime = (i: number) => {
    deleteCollection({ targetIndex: i })
  }

  useEffect(() => {
    if (isAlways) {
      setOptions({ key: "startHour", payload: "00" })
      setOptions({ key: "endHour", payload: "00" })
    }
  }, [isAlways])

  useEffect(() => {
    if (specificTime) {
      setOptions({ key: "isAlways", payload: true })
    }
  }, [specificTime])

  return (
    <div className={cx(style["layout"])}>
      <FormUserInput
        icon={faClock}
        onClick={onClickTimeSelect}
        title={section.data.title}
        description={section.data.description}
      >
        <span>{selectedTime}</span>
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
                    <h4 className={cx(style["time-min-max-title"])}>{v}</h4>
                    <input
                      onChange={(e) => onChangeTime(e, v)}
                      value={`${v === "startHour" ? startHour : endHour}:00`}
                      type="time"
                    />
                  </div>
                ))}
            </>
          )}
          {specificTime && (
            <>
              <div className={cx(style["time-add"])}>
                <h4>{t("timeAddTitle")}</h4>
                <input onChange={onChangeTimeForAdd} value={timeForAdd} type="time" />
                <button onClick={onClickAddTime}>{t("timeAdd")}</button>
              </div>
              <ul className={cx(style.times)}>
                {section.collection.map((v, i) => (
                  <li key={`${v}_${i}`}>
                    <button onClick={() => onClickDeleteSelectTime(i)}>{v}</button>
                  </li>
                ))}
              </ul>
            </>
          )}
          {!specificTime && (
            <>
              <OptionRatio optionsArr={[1, 15, 30, 60]} section={section} targetKey="interval" />
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default memo(Time)
