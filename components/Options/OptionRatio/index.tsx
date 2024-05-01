"use client"

import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import classNames from "classNames"
import { memo } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

function OptionRatio({
  targetKey,
  optionsArr,
  isDesign,
  section,
}: {
  targetKey: string
  isDesign?: boolean
  optionsArr: any[]
  section: SectionType
}) {
  const { selectedSection, setDesign, setSelectedSection, setOptions } = useEditorStore()
  const { t } = useTranslation()
  const target = isDesign ? section.design : section.options[targetKey]

  const onClickRatio = (v: any) => {
    if (selectedSection?.id !== section.id) {
      setSelectedSection({ payload: section })
    }
    if (isDesign) return setDesign({ payload: v })
    setOptions({ payload: v, key: targetKey })
  }

  return (
    <div className={cx(style.layout)}>
      <h4>{t(targetKey)}</h4>
      <div className={cx(style.content)}>
        {optionsArr.map((v) => (
          <div
            key={`options-${section.id}-${v}`}
            onClick={() => onClickRatio(v)}
            className={cx(style["ratio-wrapper"], { [style.active]: target === v })}
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
  )
}
export default memo(OptionRatio)
