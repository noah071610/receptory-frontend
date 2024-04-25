"use client"

import { SectionType } from "@/types/Edit"
import getContrastTextColor from "@/utils/getContrastTextColor"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { memo, useMemo } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

function Callout({ section }: { section: SectionType }) {
  const textColor = useMemo(() => getContrastTextColor(section.colors.bgColor), [section.colors.bgColor])
  return (
    <div className={cx(style["layout"])}>
      <div style={{ background: section.colors.bgColor }} className={cx(style.callout)}>
        <div className={cx(style["image-container"])}>
          <button>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        <div className={cx(style.main)}>
          <p>{section.value}</p>
        </div>
      </div>
    </div>
  )
}

export default memo(Callout)
