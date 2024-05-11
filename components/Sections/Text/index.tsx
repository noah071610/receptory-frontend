// @ts-ignore
import { memo } from "react"

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
  const { setValue, setList } = useEditorStore()

  const onChangeEditor = (str: string) => {
    setValue({ payload: str })
    if (typeof listIndex === "number") {
      setList({
        index: listIndex,
        key: "value",
        payload: str,
      })
    } else {
      setValue({ payload: str })
    }
  }

  // useEffect(() => {
  //   // save
  //   if (selectedSection?.id !== section.id && isEdit && editorState) {
  //     if (typeof listIndex === "number") {
  //       setList({
  //         index: listIndex,
  //         key: "text",
  //         payload: editorState,
  //         section,
  //       })
  //     } else {
  //       setText({ payload: editorState, section })
  //     }
  //     setIsEdit(false)
  //   }
  // }, [isEdit, selectedSection, editorState, section])

  // useEffect(() => {
  //   // revert
  //   if (editorState) {
  //     const load = typeof listIndex === "number" ? section.list[listIndex].text : section.text
  //     if (load) {
  //       setEditorState(load)
  //     } else {
  //       setEditorState(EditorState.createEmpty())
  //     }
  //   }
  // }, [revertIndex])

  return (
    <div className={cx("text-wrapper")}>
      <ReactQuill theme="snow" modules={modules} formats={formats} value={section.value} onChange={onChangeEditor} />
    </div>
  )
}

export default memo(Text)
