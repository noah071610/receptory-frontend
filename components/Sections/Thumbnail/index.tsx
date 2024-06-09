"use client"

import { colors } from "@/config/colors"
import { _useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { changeOpacity } from "@/utils/styles/changeOpacity"
import getContrastTextColor from "@/utils/styles/getContrastTextColor"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"
import Background from "./Background"
import Card from "./Card"
import Full from "./Full"
import Simple from "./Simple"

export default function Thumbnail({
  section,
  onClickCTA,
  isDisplayMode,
}: {
  section: SectionType
  isDisplayMode?: boolean
  onClickCTA?: () => void
}) {
  const search = useSearchParams()
  const { stage } = _useEditorStore()
  const userStage = search.get("s")
  const { color, backgroundColor } = section.style
  const design = section.design
  const imageStatus = section.options.imageStatus
  const isButtonVisible = stage === "home" && userStage !== "form" && userStage !== "confirm"

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
          onClickCTA={onClickCTA}
          borderColor={borderColor}
          ctaTextColor={ctaTextColor}
          section={section}
          textColor={textColor}
          isDisplayMode={isDisplayMode}
          isButtonVisible={isButtonVisible}
          imageStatus={imageStatus}
        />
      )}
      {design === "full" && (
        <Full
          onClickCTA={onClickCTA}
          ctaTextColor={ctaTextColor}
          section={section}
          textColor={textColor}
          isDisplayMode={isDisplayMode}
          isButtonVisible={isButtonVisible}
        />
      )}
      {design === "simple" && (
        <Simple
          onClickCTA={onClickCTA}
          section={section}
          isDisplayMode={isDisplayMode}
          isButtonVisible={isButtonVisible}
          imageStatus={imageStatus}
        />
      )}
      {design === "background" && (
        <Background
          onClickCTA={onClickCTA}
          textColor={textColor}
          ctaTextColor={ctaTextColor}
          section={section}
          isDisplayMode={isDisplayMode}
          isButtonVisible={isButtonVisible}
          imageStatus={imageStatus}
        />
      )}
    </>
  )
}
