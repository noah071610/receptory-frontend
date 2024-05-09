"use client"

import SectionLayout from "@/components/Sections/display"
import { useEditorStore } from "@/store/editor"
import cs from "classNames/bind"
import { useMemo } from "react"
import { sectionMap } from "../sectionMap"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function Preview() {
  const { initSections, formSections, stage, selectedSection } = useEditorStore()

  const sections = useMemo(
    () => (stage === "init" ? initSections : stage === "form" ? formSections : []),
    [initSections, formSections, stage]
  )

  return (
    <div className={cx("preview")}>
      <div className={cx("phone")}>
        <div className={cx("content")}>
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
