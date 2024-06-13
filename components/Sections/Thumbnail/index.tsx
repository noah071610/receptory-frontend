"use client"

import { colors } from "@/config/colors"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { PageStage } from "@/types/Main"
import { changeOpacity } from "@/utils/styles/changeOpacity"
import getContrastTextColor from "@/utils/styles/getContrastTextColor"
import { useMemo } from "react"
import Background from "./Background"
import Card from "./Card"
import Full from "./Full"
import Simple from "./Simple"

export default function Thumbnail({
  section,
  isDisplayMode,
  setPageStage,
}: {
  section: SectionType
  isDisplayMode?: boolean
  setPageStage?: (type: PageStage) => void
}) {
  const { stage } = useEditorStore(["stage"])
  const { color, backgroundColor } = section.style
  const design = section.design
  const imageStatus = section.options.imageStatus
  const isButtonVisible = isDisplayMode ? !!setPageStage : stage === "home"

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
          setPageStage={setPageStage}
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
          setPageStage={setPageStage}
          ctaTextColor={ctaTextColor}
          section={section}
          textColor={textColor}
          isDisplayMode={isDisplayMode}
          isButtonVisible={isButtonVisible}
        />
      )}
      {design === "simple" && (
        <Simple
          setPageStage={setPageStage}
          section={section}
          isDisplayMode={isDisplayMode}
          isButtonVisible={isButtonVisible}
          imageStatus={imageStatus}
        />
      )}
      {design === "background" && (
        <Background
          setPageStage={setPageStage}
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
