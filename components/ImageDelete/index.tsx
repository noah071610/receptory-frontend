"use client"

import { useEditStore } from "@/store/edit"
import { SectionType } from "@/types/Edit"
import { faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function ImageDelete({
  section,
  srcKey,
  listIndex,
}: {
  section: SectionType
  srcKey: string
  listIndex?: number
}) {
  const { selectedSection, setSelectedSection, setSrc, deleteListOrImages } = useEditStore()
  const onClickDelete = () => {
    if (!selectedSection) {
      setSelectedSection({ payload: section })
    }
    if (typeof listIndex === "number") {
      if (srcKey === "images" || srcKey === "list") {
        deleteListOrImages({ type: srcKey, targetIndex: listIndex })
      }
    } else {
      setSrc({ payload: "", key: srcKey })
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
