"use client"

import { useEditorStore } from "@/store/editor"
import { faPlay } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function PreviewBtn() {
  const { setActive } = useEditorStore(["setActive"])
  const onClickPreview = () => {
    setActive({
      key: "modal",
      payload: {
        type: "preview",
      },
    })
  }
  return (
    <div className={cx("btn-wrapper")}>
      <button onClick={onClickPreview}>
        <FontAwesomeIcon icon={faPlay} />
      </button>
    </div>
  )
}
