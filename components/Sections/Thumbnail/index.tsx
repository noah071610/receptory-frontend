"use client"

import { changeOpacity, colors } from "@/config/colors"
import { SectionType } from "@/types/Edit"
import getContrastTextColor from "@/utils/getContrastTextColor"
import cs from "classNames/bind"
import { useParams } from "next/navigation"
import { useMemo } from "react"
import Card from "./Card"
import Full from "./Full"
import Simple from "./Simple"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function Thumbnail({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { lang } = useParams()
  const { color, backgroundColor } = section.style
  const design = section.design

  const ctaTextColor = useMemo(() => getContrastTextColor(color ?? colors.blackSoft), [color])
  const textColor = useMemo(
    () => (design === "card" ? colors.black : getContrastTextColor(backgroundColor ?? colors.white)),
    [backgroundColor, design]
  )
  const borderColor = useMemo(
    () => (design === "card" ? changeOpacity(color ?? colors.border) : colors.border),
    [color, design]
  )

  return (
    <div className={cx("layout")}>
      {design === "card" && (
        <Card
          borderColor={borderColor}
          ctaTextColor={ctaTextColor}
          section={section}
          textColor={textColor}
          isDisplayMode={isDisplayMode}
        />
      )}
      {design === "full" && (
        <Full ctaTextColor={ctaTextColor} section={section} textColor={textColor} isDisplayMode={isDisplayMode} />
      )}
      {design === "simple" && <Simple ctaTextColor={ctaTextColor} section={section} isDisplayMode={isDisplayMode} />}
    </div>
  )
}
