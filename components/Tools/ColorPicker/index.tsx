"use client"
import { RgbaColorPicker } from "react-colorful"

import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import classNames from "classNames"
import { useEffect, useState } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

function rgbaStringToObject(rgbaString: string) {
  // rgba 문자열에서 각 색상 값 추출
  if (!rgbaString) return { r: 0, g: 0, b: 0, a: 1 }
  const rgbaValues = rgbaString.match(/[\d.]+/g)

  if (!rgbaValues?.length) return { r: 0, g: 0, b: 0, a: 1 }

  // 추출된 값으로 객체 생성
  const obj = {
    r: parseInt(rgbaValues[0]),
    g: parseInt(rgbaValues[1]),
    b: parseInt(rgbaValues[2]),
    a: parseFloat(rgbaValues[3]),
  }

  return obj
}

export default function ColorPicker({ colorKey }: { colorKey: "backgroundColor" | "color" | "ctaBackgroundColor" }) {
  const { t } = useTranslation()
  const { setStyle, selectedSection, setList } = useEditorStore()
  const listIndex = colorKey === "ctaBackgroundColor" ? 2 : 0

  const rgbaStr =
    colorKey === "ctaBackgroundColor"
      ? selectedSection?.list[listIndex].style.backgroundColor
      : selectedSection?.style[colorKey]
  const [color, setColor] = useState(rgbaStr ? rgbaStringToObject(rgbaStr) : { r: 0, g: 0, b: 0, a: 1 })

  const selectColor = () => {
    if (selectedSection) {
      const rgbaColor = `rgba(${color.r},${color.g},${color.b},${color.a})`
      if (colorKey === "ctaBackgroundColor") {
        setList({ index: listIndex, key: "style", payload: { backgroundColor: rgbaColor } })
      } else {
        setStyle({ key: colorKey, payload: rgbaColor })
      }
    }
  }

  useEffect(() => {
    const rgbaStr =
      colorKey === "ctaBackgroundColor"
        ? selectedSection?.list[listIndex].style.backgroundColor
        : selectedSection?.style[colorKey]
    setColor(rgbaStr ? rgbaStringToObject(rgbaStr) : { r: 0, g: 0, b: 0, a: 1 })
  }, [colorKey, selectedSection])

  return (
    selectedSection && (
      <div className={cx(style["color-picker"])}>
        <RgbaColorPicker color={color} onChange={setColor} />
        <button className={cx(style.pick)} onClick={selectColor}>
          <span>{t("컬러 선택")}</span>
        </button>
      </div>
    )
  )
}
