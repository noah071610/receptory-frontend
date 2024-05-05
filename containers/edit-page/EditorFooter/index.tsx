"use client"

import ColorPicker from "@/components/Tools/ColorPicker"
import { getEditorFooterList, getSubmenuList } from "@/config/editorFooter"
import { useEditorStore } from "@/store/editor"
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
  const { selectedSection, setActive, active, setSelectedSection, stage } = useEditorStore()
  const { lang } = useParams()
  const [isOpenAllList, setIsOpenAllList] = useState(false)
  const targetList = useMemo(() => {
    return getEditorFooterList(selectedSection, stage)
  }, [selectedSection, stage])
  const submenuList = useMemo(() => {
    return getSubmenuList(active.submenu.type, selectedSection)
  }, [selectedSection, active.submenu.type])

  const isOpenedSubmenu = useMemo(() => {
    return !!active.submenu.type && targetList
  }, [active.submenu.type, targetList])

  const onClickFooterBtn = (type: "toggle" | "close") => {
    if (type === "toggle") {
      setIsOpenAllList((prev) => !prev)
    }

    setSelectedSection({ payload: null })
    setActive({ key: "submenu", payload: { type: null } })
  }

  const activeColorSelector = active.tooltip.type?.toLowerCase()?.includes("color")

  useEffect(() => {
    if (selectedSection && isOpenAllList) setIsOpenAllList(false)
  }, [isOpenAllList, selectedSection])

  return (
    <div className={cx("editor", style.footer, { [style.isOpenAllList]: isOpenAllList })}>
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

      {active.tooltip.type && activeColorSelector && <ColorPicker colorKey={active.tooltip.type as any} />}
    </div>
  )
}
