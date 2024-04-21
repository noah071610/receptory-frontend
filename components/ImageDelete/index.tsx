"use client"

import { useEditStore } from "@/store/edit"
import { SectionType } from "@/types/Edit"
import { faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function ImageDelete({ section, srcIndex }: { section: SectionType; srcIndex: number }) {
  const { selectedSection, setSelectedSection, setSection } = useEditStore()
  const onClickDelete = () => {
    if (!selectedSection) {
      setSelectedSection({ payload: section })
    }
    setSection({ type: "src", payload: null, arrIndex: srcIndex })
  }
  return (
    <div className={cx(style["image-delete"])}>
      <button onClick={onClickDelete}>
        <FontAwesomeIcon icon={faClose} />
      </button>
    </div>
  )
}
