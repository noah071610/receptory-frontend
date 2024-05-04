"use client"

import SectionLayout from "@/components/Sections/display"
import { useEditorStore } from "@/store/editor"
import { sectionMap } from "@App/[lang]/edit/[pageId]/page"
import classNames from "classNames"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function Preview() {
  const { lang } = useParams()
  const previewRef = useRef()
  const { initSections, formSections, stage } = useEditorStore()

  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY * (630 / (window.innerHeight - 100))

      setScrollPosition(position)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const sections = useMemo(
    () => (stage === "init" ? initSections : stage === "form" ? formSections : []),
    [initSections, formSections, stage]
  )

  return (
    <div className={cx(style.preview)}>
      <div className={cx(style.phone)}>
        <div style={{ top: -scrollPosition }} className={cx(style.content)}>
          {sections.map((v) => (
            <SectionLayout noPadding={v.type === "thumbnail" || v.type === "slider"} key={`${v.id}`}>
              {sectionMap[v.type](v, true)}
            </SectionLayout>
          ))}
        </div>
      </div>
    </div>
  )
}
