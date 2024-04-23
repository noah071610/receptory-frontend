"use client"
import { HexColorPicker } from "react-colorful"

import { useEditStore } from "@/store/edit"
import { SectionColorType } from "@/types/Edit"
import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function ColorPicker({ colorKey }: { colorKey: keyof SectionColorType }) {
  const { setColor, selectedSection } = useEditStore()
  const onChangeColor = (color: string) => {
    if (selectedSection) setColor({ key: colorKey, payload: color })
  }
  return (
    selectedSection && (
      <div className={cx(style["color-picker"])}>
        <HexColorPicker color={selectedSection.colors[colorKey]} onChange={(color) => onChangeColor(color)} />
      </div>
    )
  )
}
