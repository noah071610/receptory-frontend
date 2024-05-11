// @ts-ignore
import { memo, useState } from "react"

import { bgColorArr, textColorArr } from "@/config/colors"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import cs from "classNames/bind"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import style from "./style.module.scss"
const cx = cs.bind(style)

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ align: ["right", "center", "justify"] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [
      {
        color: textColorArr,
      },
    ],
    [{ background: bgColorArr }],
  ],
}

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "color",
  "background",
  "align",
  "size",
]

const Text = ({ section, listIndex }: { section: SectionType; listIndex?: number }) => {
  const { setValue, setList, selectedSection, setSelectedSection, saveSectionHistory } = useEditorStore()
  const [initLength, setInitLength] = useState(section.value?.length ?? 0)
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
      setInitLength(section.value.length)
    }
  }

  return (
    <div className={cx("text-wrapper")}>
      <ReactQuill
        onBlur={onBlurInput}
        theme="snow"
        modules={modules}
        formats={formats}
        value={section.value}
        onChange={onChangeEditor}
      />
    </div>
  )
}

export default memo(Text)
