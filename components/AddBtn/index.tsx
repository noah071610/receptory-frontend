"use client"

import { useEditorStore } from "@/store/editor"
import { SectionListTypes, SectionType } from "@/types/Edit"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { memo } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

function AddBtn({ type, section }: { type: SectionListTypes; section: SectionType }) {
  const { setActive, addList, selectedSection, setSelectedSection } = useEditorStore()

  const onClickAddList = () => {
    if (selectedSection?.id !== section.id) {
      setSelectedSection({ payload: section })
    }
    if (type === "qna") {
      addList({ type: "qna", obj: { isActive: true } })
    } else if (type === "select") {
      addList({ type: "select" })
    } else {
      setActive({ payload: { type }, key: "modal" })
    }
  }

  return (
    <div className={cx(style["btn-wrapper"])}>
      <button onClick={onClickAddList} className={cx(style.add)}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  )
}
export default memo(AddBtn)
