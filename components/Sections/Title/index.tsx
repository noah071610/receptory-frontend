"use client"

import Input from "@/components/Input"

import { SectionType } from "@/types/Edit"
import { memo, useMemo } from "react"
import style from "./style.module.scss"

import hasString from "@/utils/helpers/hasString"
import { changeOpacity } from "@/utils/styles/changeOpacity"
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
          {isDisplayMode ? (
            hasString(label.value) && (
              <span style={labelStyle} className={cx("label")}>
                {label.value}
              </span>
            )
          ) : (
            <Input
              type="input"
              className={cx("label-input")}
              inputType="label"
              isOptional={true}
              maxLength={20}
              listIndex={2}
              value={label.value}
              style={labelStyle}
            />
          )}
        </div>
      )}
      {title.isActive &&
        (isDisplayMode ? (
          hasString(title.value) && <h1 className={cx("title")}>{title.value}</h1>
        ) : (
          <Input
            type="input"
            value={title.value}
            listIndex={0}
            className={cx("title-input")}
            inputType="title"
            isOptional={true}
            style={{ textAlign }}
          />
        ))}
      {description.isActive &&
        (isDisplayMode ? (
          hasString(description.value) && <p className={cx("description")}>{description.value}</p>
        ) : (
          <Input
            type="textarea"
            value={description.value}
            listIndex={1}
            className={cx("description-input")}
            inputType="description"
            isOptional={true}
            style={{ textAlign }}
          />
        ))}
    </div>
  )
}

export default memo(Title)
