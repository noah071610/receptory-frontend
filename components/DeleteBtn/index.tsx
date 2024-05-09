"use client"

import { useEditorStore } from "@/store/editor"
import { faClose, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import { memo } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

function DeleteBtn({
  srcKey,
  listIndex,
  isDeleteList,
  isSmall,
  deleteEvent,
}: {
  isSmall?: boolean
  isDeleteList?: boolean
  srcKey: "list" | "background" | "thumbnail" | "imageModal" | "callout" | "checklist"
  listIndex?: number
  deleteEvent?: (listIndex: number) => void
}) {
  const { setSrc, setStyle, deleteList } = useEditorStore()
  const onClickDelete = () => {
    setTimeout(() => {
      if (typeof listIndex === "number") {
        if (srcKey === "list" || srcKey === "checklist") {
          return deleteList({ targetIndex: listIndex })
        }
        if (srcKey === "imageModal") {
          return deleteEvent && deleteEvent(listIndex)
        }
      }
      if (srcKey === "background") {
        return setStyle({ key: srcKey, payload: undefined })
      }

      if (srcKey === "thumbnail" || srcKey === "callout") {
        return setSrc({ payload: "" })
      }
    }, 0)
  }
  return (
    <div className={cx("image-delete", isSmall && "small", isDeleteList && "delete-list")}>
      <button onClick={onClickDelete}>
        <FontAwesomeIcon icon={isDeleteList ? faTrash : faClose} />
      </button>
    </div>
  )
}
export default memo(DeleteBtn)
