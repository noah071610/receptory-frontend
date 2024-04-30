"use client"

import OptionRatio from "@/components/OptionRatio"
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
  const selectedTime = section.options.time
  const [startTime, endTime] = [section.options.startTime, section.options.endTime]

  const onChangeTime = (e: any, type: string) => {
    setOptions({ payload: e.target.value, key: type })
  }

  const onClickTimeSelect = () => {
    if (selectedSection?.id !== section.id) {
      setSelectedSection({ payload: section })
    }
    setActive({ key: "modal", payload: { type: "time" } })
  }

  return (
    <div className={cx(style["layout"])}>
      <button onClick={onClickTimeSelect} className={cx(style["picker"])}>
        <label className={cx(style["picker-title"])}>
          <h2>시간설정</h2>
          <p>시간을 자유자재로 설정해보세요.</p>
        </label>
        <div className={cx(style["picker-content"])}>
          <div className={cx(style.text)}>
            <span>{selectedTime}</span>
          </div>
          <div className={cx(style.icon)}>
            <FontAwesomeIcon icon={faClock} />
          </div>
        </div>
      </button>

      <div className={cx(style.options)}>
        {["startTime", "endTime"].map((v) => (
          <div key={`time-min-max-${v}`} className={cx(style["time-min-max"])}>
            <h4 className={cx(style["time-min-max-title"])}>{v}</h4>
            <input onChange={(e) => onChangeTime(e, v)} value={v === "startTime" ? startTime : endTime} type="time" />
          </div>
        ))}
        <OptionRatio optionsArr={[1, 15, 30, 60]} section={section} targetKey="interval" />
      </div>
    </div>
  )
}

export default memo(Time)
