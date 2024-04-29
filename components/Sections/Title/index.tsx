"use client"

import Input from "@/components/Input"
import Textarea from "@/components/Textarea"
import { SectionType } from "@/types/Edit"
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
      {section.list[2].isActive && (
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
          <Input
            className={cx(style["label-input"])}
            inputType="label"
            isOptional={true}
            listIndex={2}
            value={label}
            style={section.style}
          />
        </div>
      )}
      {section.list[0].isActive && (
        <Input
          value={title}
          style={section.style}
          listIndex={0}
          className={cx(style["title-input"])}
          inputType="title"
          isOptional={true}
        />
      )}
      {section.list[1].isActive && (
        <Textarea
          value={description}
          style={section.style}
          listIndex={1}
          className={cx(style["description-input"])}
          inputType="description"
          isOptional={true}
        />
      )}
    </div>
  )
}

export default memo(Title)
