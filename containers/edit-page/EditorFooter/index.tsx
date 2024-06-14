"use client"

import ColorPicker from "@/components/Tools/ColorPicker"
import { getEditorFooterList, getSubmenuList } from "@/config/editorFooter"
import { useEditorStore } from "@/store/editor"
import { Langs } from "@/types/Main"
import { faChevronUp, faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import { useEffect, useMemo, useState } from "react"
import PreviewBtn from "../PreviewBtn"
import { default as List } from "./List"
import SubList from "./SubList"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function EditorFooter({ lang }: { lang: Langs }) {
  const [isOpenAllList, setIsOpenAllList] = useState(false)

  const { selectedSection, setActive, active, setSelectedSection, stage } = useEditorStore([
    "selectedSection",
    "setActive",
    "active",
    "setSelectedSection",
    "stage",
  ])
  const targetList = useMemo(() => {
    return getEditorFooterList(selectedSection, stage)
  }, [selectedSection, stage])
  const submenuList = useMemo(() => {
    return getSubmenuList(active.submenu.type, selectedSection, stage)
  }, [active.submenu.type, selectedSection, stage])

  const isOpenedSubmenu = useMemo(() => {
    return !!active.submenu.type && targetList.length > 0
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
    <div data-closer="editor" className={cx("footer", { isOpenAllList })}>
      <PreviewBtn />
      {/* MAIN LIST (SECTIONS + SECTION) */}
      <div className={cx("main-wrapper")}>
        <div className={cx("main")}>
          <List lang={lang} isOpenAllList={isOpenAllList} isSectionList={selectedSection !== null} list={targetList} />

          <button onClick={() => onClickFooterBtn(selectedSection ? "close" : "toggle")} className={cx("footer-btn")}>
            <div className={cx("icon")}>
              <FontAwesomeIcon icon={selectedSection ? faClose : faChevronUp} />
            </div>
          </button>
        </div>
        <div className={cx("preview-ghost")}></div>
      </div>

      {/* SUB LIST (SECTIONS LIST DETAIL) */}
      <div className={cx("sub-wrapper", { active: isOpenedSubmenu })}>
        <div className={cx("sub")}>
          <SubList lang={lang} list={submenuList} />
        </div>
        <div className={cx("preview-ghost")}></div>
      </div>

      {active.tooltip.type && activeColorSelector && <ColorPicker colorKey={active.tooltip.type as any} />}
    </div>
  )
}
