"use client"

import { useEditStore } from "@/store/edit"
import { SectionType } from "@/types/Edit"
import { faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { memo } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

function ImageDelete({
  section,
  srcKey,
  listIndex,
}: {
  section: SectionType
  srcKey: "list" | "bgImage" | "thumbnail"
  listIndex?: number
}) {
  const { selectedSection, setSelectedSection, setValues, deleteList } = useEditStore()
  const onClickDelete = () => {
    if (!selectedSection) {
      setSelectedSection({ payload: section })
    }
    if (typeof listIndex === "number") {
      if (srcKey === "list") {
        deleteList({ targetIndex: listIndex })
      }
    } else {
      setValues({ payload: "", key: srcKey })
    }
  }
  return (
    <div className={cx(style["image-delete"])}>
      <button onClick={onClickDelete}>
        <FontAwesomeIcon icon={faClose} />
      </button>
    </div>
  )
}
export default memo(ImageDelete)
