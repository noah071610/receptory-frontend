"use client"

import Input from "@/components/Input"
import Textarea from "@/components/Textarea"
import { changeOpacity } from "@/config/colors"
import { SectionType } from "@/types/Edit"
import classNames from "classNames"
import { memo, useMemo } from "react"
import style from "./style.module.scss"

const cx = classNames.bind(style)

function Title({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const [title, description, label] = section.list
  const textAlign = section.style.textAlign

  const { color } = label.style
  const backgroundColor = useMemo(() => changeOpacity(color ?? "rgba(255,255,255,1)", 0.1), [color])
  const labelStyle = useMemo(
    () => ({
      textAlign,
      border: `1px solid ${color}`,
      backgroundColor,
    }),
    [backgroundColor, color, textAlign]
  )

  return (
    <div className={cx(style["layout"])}>
      {label.isActive && (
        <div
          style={{
            justifyContent: textAlign === "left" ? "flex-start" : textAlign === "right" ? "flex-end" : "center",
          }}
          className={cx(style["label-wrapper"])}
        >
          <Input
            section={section}
            className={cx(isDisplayMode ? style.label : style["label-input"])}
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
          section={section}
          value={title.value}
          listIndex={0}
          displayMode={isDisplayMode && "h1"}
          className={cx(isDisplayMode ? style.title : style["title-input"])}
          inputType="title"
          isOptional={true}
          style={{ textAlign }}
        />
      )}
      {description.isActive && (
        <Textarea
          section={section}
          value={description.value}
          listIndex={1}
          displayMode={isDisplayMode && "p"}
          className={cx(isDisplayMode ? style.description : style["description-input"])}
          inputType="description"
          isOptional={true}
          style={{ textAlign }}
        />
      )}
    </div>
  )
}

export default memo(Title)
