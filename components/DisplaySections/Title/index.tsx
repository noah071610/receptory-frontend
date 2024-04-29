"use client"

import { SectionType } from "@/types/Edit"
import hasString from "@/utils/hasString"
import classNames from "classNames"
import { memo } from "react"
import style from "./style.module.scss"

const cx = classNames.bind(style)

function Title({ section }: { section: SectionType }) {
  const label = section.list[2].value
  const title = section.list[0].value
  const description = section.list[1].value
  return (
    <div className={cx(style["layout"])}>
      {section.list[2].isActive && hasString(label) && (
        <div
          style={{
            justifyContent:
              section.style.textAlign === "left"
                ? "flex-start"
                : section.style.textAlign === "right"
                  ? "flex-end"
                  : "center",
          }}
          className={cx(style["label-wrapper"])}
        >
          <span style={section.style} className={cx(style.label)}>
            {label}
          </span>
        </div>
      )}
      {section.list[0].isActive && hasString(title) && (
        <h1 style={section.style} className={cx(style.title)}>
          {title}
        </h1>
      )}
      {section.list[1].isActive && hasString(description) && (
        <p style={section.style} className={cx(style.description)}>
          {description}
        </p>
      )}
    </div>
  )
}

export default memo(Title)
