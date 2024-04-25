"use client"

import { AlignTypes, SectionType } from "@/types/Edit"
import classNames from "classNames"
import { memo } from "react"
import style from "./style.module.scss"

const cx = classNames.bind(style)

function Title({ section }: { section: SectionType }) {
  const filteredComponents = section.list.filter((v) => v.isActive)
  return (
    <div className={cx(style["layout"])}>
      {section.list[2].isActive && !!section.label.trim() && (
        <div
          style={{
            justifyContent:
              section.style === "left" ? "flex-start" : section.style === "right" ? "flex-end" : section.style,
          }}
          className={cx(style["label-wrapper"])}
        >
          <span
            style={{ color: section.colors.textColor, textAlign: section.style as AlignTypes }}
            className={cx(style.label)}
          >
            {section.label}
          </span>
        </div>
      )}
      {section.list[0].isActive && (
        <h1
          style={{ color: section.colors.textColor, textAlign: section.style as AlignTypes }}
          className={cx(style.title)}
        >
          {section.title}
        </h1>
      )}
      {section.list[1].isActive && (
        <p
          style={{ color: section.colors.textColor, textAlign: section.style as AlignTypes }}
          className={cx(style.description)}
        >
          {section.description}
        </p>
      )}
    </div>
  )
}

export default memo(Title)
