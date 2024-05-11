"use client"

import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import cs from "classNames/bind"
import { memo } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

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
  const { selectedSection, setDesign, setSelectedSection, setOptions, saveSectionHistory } = useEditorStore()
  const { t } = useTranslation()
  const target = isDesign ? section.design : section.options[targetKey]

  const onClickRatio = (v: any) => {
    if (selectedSection?.id !== section.id) {
      setSelectedSection({ payload: section })
    }
    if (isDesign) return setDesign({ payload: v })
    setOptions({ payload: v, key: targetKey })
    saveSectionHistory()
  }

  return (
    <div className={cx("layout")}>
      <h4>{t(targetKey)}</h4>
      <div className={cx("content")}>
        {optionsArr.map((v) => (
          <div
            key={`options-${section.id}-${v}`}
            onClick={() => onClickRatio(v)}
            className={cx("ratio-wrapper", { active: target === v })}
          >
            <div className={cx("ratio")}>
              <div className={cx("circle")}></div>
            </div>
            <div className={cx("label")}>
              <label>{t(`${v}`)}</label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default memo(OptionRatio)
