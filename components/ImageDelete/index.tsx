"use client"

import { useEditStore } from "@/store/edit"
import { faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function ImageDelete({ srcIndex }: { srcIndex: number }) {
  const { selectedSection, setSection } = useEditStore()
  const onClickDelete = () => {
    if (selectedSection) {
      setSection({ type: "src", payload: null, arrIndex: srcIndex })
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
