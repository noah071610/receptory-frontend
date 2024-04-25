"use client"

import { getImageUrl } from "@/config"
import { SectionType } from "@/types/Edit"
import getContrastTextColor from "@/utils/getContrastTextColor"
import hasString from "@/utils/hasString"
import classNames from "classNames"
import { useParams } from "next/navigation"
import { useMemo } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function Thumbnail({ section }: { section: SectionType }) {
  const { lang } = useParams()

  const customColors = useMemo(() => section.colors, [section.colors])
  const ctaTextColor = useMemo(() => getContrastTextColor(section.colors.ctaColor), [section.colors.ctaColor])

  return (
    <div
      style={{
        background: section.values["bgImage"]
          ? getImageUrl({ isCenter: true, url: section.values["bgImage"] ?? "" })
          : `linear-gradient(180deg, ${customColors.bgColor} 87%, rgba(0,0,0,0) 100%)`,
      }}
      className={cx(style.wrapper, style.mobile)}
    >
      <div className={cx(style.main)}>
        {hasString(section.values["thumbnail"]) && (
          <div
            style={{ background: getImageUrl({ isCenter: true, url: section.values["thumbnail"] ?? "" }) }}
            className={cx(style.thumbnail)}
          ></div>
        )}
        <h1 style={{ color: customColors.textColor }} className={cx(style.title)}>
          {section.title}
        </h1>
        <p style={{ color: customColors.textColor }} className={cx(style.description)}>
          {section.description}
        </p>
        <div className={cx(style["cta-wrapper"])}>
          <button style={{ backgroundColor: customColors.ctaColor }} className={cx(style.cta)}>
            <span style={{ color: ctaTextColor }}>
              {section.values["ctaText"] ? section.values["ctaText"] : "에헤"}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
