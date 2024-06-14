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
  const { setActive, addList, selectedSection, setSelectedSection } = useEditorStore([
    "setActive",
    "addList",
    "selectedSection",
    "setSelectedSection",
  ])

  const onClickAddList = () => {
    if (!selectedSection || selectedSection?.id !== section.id) {
      setSelectedSection({ payload: section })
    }

    switch (type) {
      case "qna":
      // qna의 new list 의 추가 ojb { isActive: true, data: { title: "title.." } }
      // 는 createNewSectionList에서 자동으로 추가한다
      case "select":
      case "checkList":
        return addList({ type })

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
