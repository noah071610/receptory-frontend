"use client"

import { useTranslation } from "@/i18n/client"
import { _useEditorStore } from "@/store/editor"
import { useMainStore } from "@/store/main"
import { SectionType } from "@/types/Edit"
import cs from "classNames/bind"
import { memo } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

function OptionBar({ value, section }: { value: string; section: SectionType }) {
  const { selectedSection, setSelectedSection, setOptions, saveSectionHistory } = _useEditorStore()
  const { pageLang } = useMainStore(["pageLang"])
  const { t } = useTranslation(pageLang, ["edit-page"])
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
