"use client"

import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import { memo } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

function AddBtn({ type, section }: { type: string; section: SectionType }) {
  const { setActive, addList, selectedSection, setSelectedSection } = useEditorStore()

  const onClickAddList = () => {
    if (selectedSection?.id !== section.id) {
      setSelectedSection({ payload: section })
    }
    switch (type) {
      case "qna":
      case "select":
        return addList({ type })
      case "checkList":
        return addList({ type, valueArrForNewList: [{ design: "check" }] })

      default:
        setActive({ payload: { type, payload: "add" }, key: "modal" })
        break
    }
  }

  return (
    <div className={cx("btn-wrapper")}>
      <button data-closer="add" onClick={onClickAddList} className={cx("add")}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  )
}
export default memo(AddBtn)
