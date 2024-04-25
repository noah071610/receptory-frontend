"use client"

import { useEditStore } from "@/store/edit"
import { SectionType } from "@/types/Edit"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { memo } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

function AddBtn({ type, section }: { type: string; section: SectionType }) {
  const { setActive, addList, selectedSection, setSelectedSection } = useEditStore()

  const onClickAddList = () => {
    if (!selectedSection) {
      setSelectedSection({ payload: section })
    }
    if (type === "qna") {
      addList({ type: "qna" })
    } else {
      setActive({ payload: type, key: "sectionModal" })
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
