"use client"

import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import classNames from "classNames"
import { memo } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

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
    <div className={cx(style["layout"])}>
      <button onClick={onClickSlider} className={cx(style.content, { [style.active]: !!isActive })}>
        <h2>{t(value)}</h2>
        <div className={cx(style.bar)}>
          <div className={cx(style.circle)}></div>
        </div>
      </button>
    </div>
  )
}
export default memo(OptionBar)
