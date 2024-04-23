"use client"

import { getEditorFooterList, getSubmenuList } from "@/config/editorFooter"
import { useEditStore } from "@/store/edit"
import classNames from "classNames"
import { useParams } from "next/navigation"
import { useMemo } from "react"
import { default as List } from "./List"
import SubList from "./SubList"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function EditorFooter() {
  const { selectedSection, openedSubmenu } = useEditStore()
  const { lang } = useParams()
  const targetList = useMemo(() => {
    return getEditorFooterList(selectedSection)
  }, [selectedSection])
  const submenuList = useMemo(() => {
    return getSubmenuList(openedSubmenu, selectedSection)
  }, [selectedSection, openedSubmenu])

  const isOpened = useMemo(() => {
    return !!openedSubmenu && targetList
  }, [openedSubmenu, targetList])

  return (
    <div id="editor" className={cx(style.footer)}>
      <div className={cx(style["main-wrapper"])}>
        <div className={cx(style.main)}>
          <List isSectionList={selectedSection !== null} list={targetList} />
        </div>
        <div className={cx(style["preview-ghost"])}></div>
      </div>

      <div className={cx(style["sub-wrapper"], { [style.active]: isOpened })}>
        <div id="editor" className={cx(style.sub)}>
          <SubList list={submenuList} />
        </div>
        <div className={cx(style["preview-ghost"])}></div>
      </div>
    </div>
  )
}
