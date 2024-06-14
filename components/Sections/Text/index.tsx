// @ts-ignore
import { memo, useState } from "react"

import { textEditorFormats, textEditorModules } from "@/config/edit"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import cs from "classNames/bind"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import style from "./style.module.scss"
const cx = cs.bind(style)

const Text = ({ section, listIndex }: { section: SectionType; listIndex?: number }) => {
  const { setValue, setList, selectedSection, setSelectedSection, saveSectionHistory } = useEditorStore([
    "setValue",
    "setList",
    "selectedSection",
    "setSelectedSection",
    "saveSectionHistory",
  ])
  const targetValue = typeof listIndex === "number" ? section.list[listIndex]?.value : section?.value
  const [initLength, setInitLength] = useState(targetValue?.length ?? 0)
  const [isEdited, setIsEdited] = useState(false)

  const onChangeEditor = (str: string) => {
    if (!selectedSection) {
      setSelectedSection({ payload: section })
    }
    if (typeof listIndex === "number") {
      setList({
        index: listIndex,
        key: "value",
        payload: str,
      })
    } else {
      setValue({ payload: str })
    }
    if (!isEdited && initLength !== str.length) {
      setIsEdited(true)
    }
  }

  const onBlurInput = () => {
    if (isEdited) {
      saveSectionHistory()
      setIsEdited(false)
      setInitLength(targetValue.length)
    }
  }

  return (
    <div className={cx("text-wrapper")}>
      <ReactQuill
        onBlur={onBlurInput}
        theme="snow"
        modules={textEditorModules}
        formats={textEditorFormats}
        value={targetValue}
        onChange={onChangeEditor}
      />
    </div>
  )
}

export default memo(Text)
