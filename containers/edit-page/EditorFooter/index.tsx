"use client"

import { sectionList, thumbnailList, useEditStore } from "@/store/edit"
import classNames from "classNames"
import { useParams } from "next/navigation"
import { useMemo } from "react"
import { default as List } from "./List"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function EditorFooter() {
  const { selectedSection } = useEditStore()
  const { lang } = useParams()
  const targetList = useMemo(() => {
    if (selectedSection === null) return sectionList

    switch (selectedSection?.type) {
      case "thumbnail":
        return thumbnailList

      default:
        return sectionList
    }
  }, [selectedSection])

  return (
    <div className={cx(style.footer)}>
      <div id="editor" className={cx(style.main)}>
        <List isSectionList={selectedSection !== null} list={targetList} />
      </div>
      <div className={cx(style["preview-ghost"])}></div>
    </div>
  )
}
