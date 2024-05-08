"use client"

import { useEditorStore } from "@/store/editor"
import { faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import { memo } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

function ImageDelete({
  srcKey,
  listIndex,
  deleteEvent,
}: {
  srcKey: "list" | "background" | "thumbnail" | "imageModal"
  listIndex?: number
  deleteEvent?: (listIndex: number) => void
}) {
  const { setSrc, setStyle, deleteList } = useEditorStore()
  const onClickDelete = () => {
    setTimeout(() => {
      if (typeof listIndex === "number") {
        if (srcKey === "list") {
          return deleteList({ targetIndex: listIndex })
        }
        if (srcKey === "imageModal") {
          return deleteEvent && deleteEvent(listIndex)
        }
      }
      if (srcKey === "background") {
        return setStyle({ key: srcKey, payload: undefined })
      }

      if (srcKey === "thumbnail") {
        return setSrc({ payload: "" })
      }
    }, 0)
  }
  return (
    <div className={cx("image-delete")}>
      <button onClick={onClickDelete}>
        <FontAwesomeIcon icon={faClose} />
      </button>
    </div>
  )
}
export default memo(ImageDelete)
