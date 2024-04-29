"use client"

import { getImageUrl } from "@/config"
import { colors } from "@/config/colors"
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

  const title = section.list[0]

  const description = section.list[1]

  const cta = section.list[2]
  const ctaStyle = section.list[2].style

  const ctaTextColor = useMemo(
    () => getContrastTextColor(ctaStyle.backgroundColor ?? colors.blackSoft),
    [ctaStyle.backgroundColor]
  )
  const textColor = useMemo(
    () => getContrastTextColor(section.style.backgroundColor ?? colors.white),
    [section.style.backgroundColor]
  )

  return (
    <div
      style={{
        background: section.style.background
          ? getImageUrl({ isCenter: true, url: section.style.background ?? "" })
          : `linear-gradient(180deg, ${section.style.backgroundColor} 87%, rgba(0,0,0,0) 100%)`,
      }}
      className={cx(style.wrapper, style.mobile)}
    >
      <div className={cx(style.main)}>
        {hasString(section.src) && (
          <div
            style={{ background: getImageUrl({ isCenter: true, url: section.src ?? "" }) }}
            className={cx(style.thumbnail)}
          ></div>
        )}
        <h1 style={{ color: textColor }} className={cx(style.title)}>
          {title.value}
        </h1>
        <p style={{ color: textColor }} className={cx(style.description)}>
          {description.value}
        </p>
        <div className={cx(style["cta-wrapper"])}>
          <button style={{ backgroundColor: ctaStyle.backgroundColor }} className={cx(style.cta)}>
            <span style={{ color: ctaTextColor }}>{cta.value ? cta.value : "todo://"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
