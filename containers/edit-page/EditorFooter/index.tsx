"use client"

import ColorPicker from "@/components/Tools/ColorPicker"
import { getEditorFooterList, getSubmenuList } from "@/config/editorFooter"
import { useEditStore } from "@/store/edit"
import { faChevronUp, faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { default as List } from "./List"
import SubList from "./SubList"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function EditorFooter() {
  const { selectedSection, setActive, active, setSelectedSection } = useEditStore()
  const { lang } = useParams()
  const [isOpenAllList, setIsOpenAllList] = useState(false)
  const targetList = useMemo(() => {
    return getEditorFooterList(selectedSection)
  }, [selectedSection])
  const submenuList = useMemo(() => {
    return getSubmenuList(active.submenu, selectedSection)
  }, [selectedSection, active.submenu])

  const isOpenedSubmenu = useMemo(() => {
    return !!active.submenu && targetList
  }, [active.submenu, targetList])

  const onClickFooterBtn = (type: "toggle" | "close") => {
    if (type === "toggle") {
      setIsOpenAllList((prev) => !prev)
    }

    setSelectedSection({ payload: null })
    setActive({ key: "submenu", payload: null })
  }

  useEffect(() => {
    if (selectedSection && isOpenAllList) setIsOpenAllList(false)
  }, [isOpenAllList, selectedSection])

  return (
    <div id="editor" className={cx(style.footer, { [style.isOpenAllList]: isOpenAllList })}>
      {/* MAIN LIST (SECTIONS + SECTION) */}
      <div className={cx(style["main-wrapper"])}>
        <div className={cx(style.main)}>
          <List isOpenAllList={isOpenAllList} isSectionList={selectedSection !== null} list={targetList} />

          <button
            onClick={() => onClickFooterBtn(selectedSection ? "close" : "toggle")}
            className={cx(style["footer-btn"], { [style.active]: isOpenAllList })}
          >
            <div className={cx(style.icon)}>
              <FontAwesomeIcon icon={selectedSection ? faClose : faChevronUp} />
            </div>
          </button>
        </div>
        <div className={cx(style["preview-ghost"])}></div>
      </div>

      {/* SUB LIST (SECTIONS LIST DETAIL) */}
      <div className={cx(style["sub-wrapper"], { [style.active]: isOpenedSubmenu })}>
        <div className={cx(style.sub)}>
          <SubList list={submenuList} />
        </div>
        <div className={cx(style["preview-ghost"])}></div>
      </div>

      {(active.tooltip === "bgColor" || active.tooltip === "textColor" || active.tooltip === "ctaColor") && (
        <ColorPicker colorKey={active.tooltip} />
      )}
    </div>
  )
}
