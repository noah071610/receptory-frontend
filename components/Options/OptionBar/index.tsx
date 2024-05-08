"use client"

import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import cs from "classNames/bind"
import { memo } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

function OptionBar({ value, section }: { value: string; section: SectionType }) {
  const { selectedSection, setSelectedSection, setOptions } = useEditorStore()
  const { t } = useTranslation()
  const isActive = section.options[value]

  const onClickSlider = () => {
    if (selectedSection?.id !== section.id) {
      setSelectedSection({ payload: section })
    }

    setOptions({ key: value, payload: !isActive })
  }

  return (
    <div className={cx("layout")}>
      <button onClick={onClickSlider} className={cx("content", { active: !!isActive })}>
        <h4>{t(value)}</h4>
        <div className={cx("bar")}>
          <div className={cx("circle")}></div>
        </div>
      </button>
    </div>
  )
}
export default memo(OptionBar)
