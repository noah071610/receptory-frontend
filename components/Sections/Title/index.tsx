"use client"

import Input from "@/components/Input"
import Textarea from "@/components/Textarea"
import { AlignTypes, SectionType } from "@/types/Edit"
import classNames from "classNames"
import { memo } from "react"
import style from "./style.module.scss"

const cx = classNames.bind(style)

function Title({ section }: { section: SectionType }) {
  const filteredComponents = section.list.filter((v) => v.isActive)
  return (
    <div className={cx(style["layout"])}>
      {section.list[2].isActive && (
        <div
          style={{
            justifyContent:
              section.style === "left" ? "flex-start" : section.style === "right" ? "flex-end" : section.style,
          }}
          className={cx(style["label-wrapper"])}
        >
          <Input
            color={section.colors.textColor}
            textAlign={section.style as AlignTypes}
            className={cx(style["label-input"])}
            inputType="label"
            isOptional={true}
            value={section.label}
          />
        </div>
      )}
      {section.list[0].isActive && (
        <Input
          color={section.colors.textColor}
          textAlign={section.style as AlignTypes}
          className={cx(style["title-input"])}
          inputType="title"
          isOptional={true}
          value={section.title}
        />
      )}
      {section.list[1].isActive && (
        <Textarea
          color={section.colors.textColor}
          textAlign={section.style as AlignTypes}
          className={cx(style["description-input"])}
          inputType="description"
          isOptional={true}
          value={section.description}
        />
      )}
    </div>
  )
}

export default memo(Title)
