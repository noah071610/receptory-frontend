"use client"

import SectionLayout from "@/components/Sections/display"
import { useEditorStore } from "@/store/editor"
import { sectionMap } from "@App/[lang]/edit/[pageId]/page"
import classNames from "classNames"
import { useMemo } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function Preview() {
  const { initSections, formSections, stage, selectedSection } = useEditorStore()

  const sections = useMemo(
    () => (stage === "init" ? initSections : stage === "form" ? formSections : []),
    [initSections, formSections, stage]
  )

  return (
    <div className={cx(style.preview)}>
      <div className={cx(style.phone)}>
        <div className={cx(style.content)}>
          {sections.map((v) => (
            <SectionLayout id={v.id} noPadding={v.type === "thumbnail" || v.type === "slider"} key={`${v.id}`}>
              {sectionMap[v.type](v, true)}
            </SectionLayout>
          ))}
        </div>
      </div>
    </div>
  )
}
