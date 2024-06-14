"use client"
import { RgbaColorPicker } from "react-colorful"

import { useEditorStore } from "@/store/editor"
import cs from "classnames/bind"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = cs.bind(style)

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

export default function ColorPicker({
  colorKey,
}: {
  colorKey: "backgroundColor" | "color" | "ctaBackgroundColor" | "labelColor"
}) {
  const { t } = useTranslation(["edit-page"])
  const { setStyle, selectedSection, setList, currentUsedColors, addUsed } = useEditorStore([
    "setStyle",
    "selectedSection",
    "setList",
    "currentUsedColors",
    "addUsed",
  ])
  const listIndex = colorKey === "ctaBackgroundColor" || colorKey === "labelColor" ? 2 : 0

  const targetColor = useMemo(() => {
    switch (colorKey) {
      case "ctaBackgroundColor":
        return selectedSection?.style.color
      case "labelColor":
        return selectedSection?.list[listIndex].style.color
      default:
        return selectedSection?.style[colorKey]
    }
  }, [colorKey, listIndex, selectedSection])

  const [color, setColor] = useState(targetColor ? rgbaStringToObject(targetColor) : { r: 0, g: 0, b: 0, a: 1 })

  const selectColor = () => {
    if (selectedSection) {
      const rgbaColor = `rgba(${color.r},${color.g},${color.b},${color.a})`
      addUsed({ type: "currentUsedColors", payload: rgbaColor })
      switch (colorKey) {
        case "ctaBackgroundColor":
          return setStyle({ key: "color", payload: rgbaColor })
        case "labelColor":
          return setList({ index: listIndex, key: "style", payload: { color: rgbaColor } })
        default:
          return setStyle({ key: colorKey, payload: rgbaColor })
      }
    }
  }

  const onClickCurColor = (v: string) => {
    setColor(rgbaStringToObject(v))
  }

  useEffect(() => {
    setColor(targetColor ? rgbaStringToObject(targetColor) : { r: 0, g: 0, b: 0, a: 1 })
  }, [targetColor, selectedSection])

  return (
    selectedSection && (
      <div className={cx("color-picker")}>
        <RgbaColorPicker className={style.picker} color={color} onChange={setColor} />
        {currentUsedColors?.length > 0 && (
          <div className={cx("curColors")}>
            {currentUsedColors.map((v, i) => (
              <button onClick={() => onClickCurColor(v)} key={`${v}-${i}`} style={{ backgroundColor: v }}></button>
            ))}
          </div>
        )}
        <button className={cx("pick")} onClick={selectColor}>
          <span>{t("selectColor")}</span>
        </button>
      </div>
    )
  )
}
