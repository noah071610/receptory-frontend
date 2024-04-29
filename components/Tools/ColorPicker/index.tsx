"use client"
import { HexColorPicker } from "react-colorful"

import { useEditorStore } from "@/store/editor"
import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function ColorPicker({ colorKey }: { colorKey: "backgroundColor" | "color" | "ctaBackgroundColor" }) {
  const { setStyle, selectedSection, setList } = useEditorStore()
  const listIndex = colorKey === "ctaBackgroundColor" ? 2 : 0
  const onChangeColor = (color: string) => {
    if (selectedSection) {
      if (colorKey === "ctaBackgroundColor") {
        setList({ index: listIndex, key: "style", payload: { backgroundColor: color } })
      } else {
        setStyle({ key: colorKey, payload: color })
      }
    }
  }
  return (
    selectedSection && (
      <div className={cx(style["color-picker"])}>
        <HexColorPicker
          color={
            colorKey === "ctaBackgroundColor"
              ? selectedSection.list[listIndex].style.backgroundColor
              : selectedSection.style[colorKey]
          }
          onChange={(color) => onChangeColor(color)}
        />
      </div>
    )
  )
}
