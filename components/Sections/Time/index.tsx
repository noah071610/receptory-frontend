"use client"

import Input from "@/components/Input"
import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { faClock } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { memo } from "react"
import style from "./style.module.scss"

const cx = classNames.bind(style)

function Time({ section }: { section: SectionType }) {
  const { t } = useTranslation()
  const { setOptions, selectedSection, setSelectedSection, setActive } = useEditorStore()
  const isModalDesign = section.design === "modal"
  const interval = section.options.interval
  const selectedTime = section.options.time
  const [startTime, endTime] = [section.options.startTime, section.options.endTime]

  const onChangeTime = (e: any, type: string) => {
    setOptions({ payload: e.target.value, key: type })
  }

  const onClickInterval = (v: number) => {
    if (!selectedSection) {
      setSelectedSection({ payload: section })
    }
    setOptions({ payload: v, key: "interval" })
  }

  const onClickTimeSelect = () => {
    if (!selectedSection) {
      setSelectedSection({ payload: section })
    }
    setActive({ key: "modal", payload: "time" })
  }

  return (
    <div className={cx(style["layout"])}>
      <Input className={cx(style.title)} inputType="calender" isOptional={true} value={section.value} />
      <div className={cx(style["time-input-wrapper"])}>
        <div className={cx(style["time-input"])}>
          <h4>시간설정</h4>
          <button onClick={onClickTimeSelect} className={cx(style["time-btn"])}>
            <span>{selectedTime}</span>
            <FontAwesomeIcon icon={faClock} />
          </button>
        </div>
      </div>

      <div className={cx(style.options)}>
        {["startTime", "endTime"].map((v) => (
          <div key={`time-min-max-${v}`} className={cx(style["time-min-max"])}>
            <h4 className={cx(style["time-min-max-title"])}>{v}</h4>
            <input onChange={(e) => onChangeTime(e, v)} value={v === "startTime" ? startTime : endTime} type="time" />
          </div>
        ))}
        <div className={cx(style.interval)}>
          <h4 className={cx(style["ratio-title"])}>interval</h4>
          <div className={cx(style.content)}>
            {[1, 15, 30, 60].map((v) => (
              <div
                key={`interval-${v}`}
                onClick={() => onClickInterval(v)}
                className={cx(style["ratio-wrapper"], { [style.active]: interval === v })}
              >
                <div className={cx(style.ratio)}>
                  <div className={cx(style.circle)}></div>
                </div>
                <div className={cx(style.label)}>
                  <label>{t(`${v}`)}</label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Time)
