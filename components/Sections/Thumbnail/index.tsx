"use client"

import { colors } from "@/config/colors"
import { SectionType } from "@/types/Edit"
import { changeOpacity } from "@/utils/styles/changeOpacity"
import getContrastTextColor from "@/utils/styles/getContrastTextColor"
import { useParams } from "next/navigation"
import { useMemo } from "react"
import Background from "./Background"
import Card from "./Card"
import Full from "./Full"
import Simple from "./Simple"

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
    <>
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
      {design === "simple" && <Simple section={section} isDisplayMode={isDisplayMode} />}
      {design === "background" && (
        <Background textColor={textColor} ctaTextColor={ctaTextColor} section={section} isDisplayMode={isDisplayMode} />
      )}
    </>
  )
}
