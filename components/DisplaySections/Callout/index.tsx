"use client"

import { getImageUrl } from "@/config"
import { colors } from "@/config/colors"
import { SectionType } from "@/types/Edit"
import getContrastTextColor from "@/utils/getContrastTextColor"
import classNames from "classNames"
import { stateToHTML } from "draft-js-export-html"
import { memo, useMemo } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

function Callout({ section }: { section: SectionType }) {
  const textColor = useMemo(
    () => getContrastTextColor(section.style.backgroundColor ?? colors.white),
    [section.style.backgroundColor]
  )

  return (
    <div className={cx(style["layout"])}>
      <div style={section.style} className={cx(style.callout)}>
        <div className={cx(style["image-container"])}>
          <div
            className={cx(style.image)}
            style={{ background: getImageUrl({ isCenter: true, url: section.src ?? "" }) }}
          ></div>
        </div>
        <div
          style={{ color: textColor }}
          dangerouslySetInnerHTML={{ __html: stateToHTML(section.text.getCurrentContent()) }}
          className={cx(style.main)}
        ></div>
      </div>
    </div>
  )
}

export default memo(Callout)
