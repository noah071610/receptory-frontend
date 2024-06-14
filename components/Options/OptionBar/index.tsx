"use client"

import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import cs from "classnames/bind"
import { memo } from "react"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = cs.bind(style)

function OptionBar({ value, section }: { value: string; section: SectionType }) {
  const { selectedSection, setSelectedSection, setOptions, saveSectionHistory } = useEditorStore([
    "selectedSection",
    "setSelectedSection",
    "setOptions",
    "saveSectionHistory",
  ])

  const { t } = useTranslation(["edit-page"])
  const isActive = section.options[value]

  const onClickSlider = () => {
    if (selectedSection?.id !== section.id) {
      setSelectedSection({ payload: section })
    }

    setOptions({ key: value, payload: !isActive })
    saveSectionHistory()
  }

  return (
    <button onClick={onClickSlider} className={cx("layout", { active: !!isActive })}>
      <div className={cx("content")}>
        <div className={cx("bar")}>
          <div className={cx("circle")}></div>
        </div>
      </div>
      <span>{t(`options.${value}`)}</span>
    </button>
  )
}
export default memo(OptionBar)
