"use client"

import { useEditorStore } from "@/store/editor"
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
  srcKey: "list" | "background" | "thumbnail"
  listIndex?: number
}) {
  const { selectedSection, setSelectedSection, setSrc, setStyle, deleteList } = useEditorStore()
  const onClickDelete = () => {
    if (selectedSection?.id !== section.id) {
      setSelectedSection({ payload: section })
    }
    if (typeof listIndex === "number") {
      if (srcKey === "list") {
        return deleteList({ targetIndex: listIndex })
      }
    }
    if (srcKey === "background") {
      return setStyle({ key: srcKey, payload: undefined })
    }

    if (srcKey === "thumbnail") {
      return setSrc({ payload: "" })
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
