"use client"

import Input from "@/components/Input"
import { changeOpacity } from "@/config/colors"
import { SectionType } from "@/types/Edit"
import { memo, useMemo } from "react"
import style from "./style.module.scss"

import cs from "classNames/bind"
const cx = cs.bind(style)

function Title({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const [title, description, label] = section.list
  const textAlign = section.style.textAlign

  const { color } = label.style
  const backgroundColor = useMemo(() => changeOpacity(color ?? "rgba(255,255,255,1)", 0.1), [color])
  const labelStyle = useMemo(
    () => ({
      textAlign,
      color,
    }),
    [backgroundColor, color, textAlign]
  )

  return (
    <div className={cx("layout")}>
      {label.isActive && (
        <div
          style={{
            justifyContent: textAlign === "left" ? "flex-start" : textAlign === "right" ? "flex-end" : "center",
          }}
          className={cx("label-wrapper")}
        >
          <Input
            type="input"
            className={cx(isDisplayMode ? "label" : "label-input")}
            inputType="label"
            displayMode={isDisplayMode && "span"}
            isOptional={true}
            maxLength={20}
            listIndex={2}
            value={label.value}
            style={labelStyle}
          />
        </div>
      )}
      {title.isActive && (
        <Input
          type="input"
          value={title.value}
          listIndex={0}
          displayMode={isDisplayMode && "h1"}
          className={cx(isDisplayMode ? "title" : "title-input")}
          inputType="title"
          isOptional={true}
          style={{ textAlign }}
        />
      )}
      {description.isActive && (
        <Input
          type="textarea"
          value={description.value}
          listIndex={1}
          displayMode={isDisplayMode && "p"}
          className={cx(isDisplayMode ? "description" : "description-input")}
          inputType="description"
          isOptional={true}
          style={{ textAlign }}
        />
      )}
    </div>
  )
}

export default memo(Title)
