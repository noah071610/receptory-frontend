// @ts-ignore
import { ContentBlock, DraftHandleValue, Editor, EditorState, RichUtils, convertFromRaw, convertToRaw } from "draft-js"
import { memo, useEffect, useRef, useState } from "react"

import Toolbar from "./_components/Toolbar"

import { colors } from "@/config/colors"
import { editorStyleMap } from "@/config/edit"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import cs from "classNames/bind"
import style from "./style.module.scss"
const cx = cs.bind(style)

const Text = ({ section, textColor, listIndex }: { section: SectionType; textColor?: string; listIndex?: number }) => {
  const { selectedSection, setText, setList, saveSectionHistory } = useEditorStore()
  const [editorState, setEditorState] = useState<null | EditorState>(null)
  const editorRef = useRef(null)
  const [isEdit, setIsEdit] = useState(false)

  const onChangeEditor = (editor: EditorState) => {
    setIsEdit(true)
    setEditorState(editor)
  }
  const handleKeyCommand = (command: string, editorState: EditorState): DraftHandleValue => {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      setEditorState(newState)
      return "handled"
    }
    return "not-handled"
  }

  // FOR BLOCK LEVEL STYLES(Returns CSS Class From Text.css)
  const myBlockStyleFn = (block: ContentBlock): any => {
    const type = block.getType()
    switch (type) {
      case "blockQuote":
        return "superFancyBlockquote"
      case "leftAlign":
        return "leftAlign"
      case "rightAlign":
        return "rightAlign"
      case "centerAlign":
        return "centerAlign"
      case "justifyAlign":
        return "justifyAlign"
      default:
        break
    }
  }

  useEffect(() => {
    // save
    if (selectedSection === null && isEdit && editorState) {
      if (typeof listIndex === "number") {
        setList({
          index: listIndex,
          key: "text",
          payload: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
          section,
        })
      } else {
        setText({ payload: JSON.stringify(convertToRaw(editorState.getCurrentContent())), section })
      }
      setTimeout(() => {
        saveSectionHistory({ payload: section })
      }, 100)
      setIsEdit(false)
    }
  }, [isEdit, selectedSection, editorState, section])

  useEffect(() => {
    // load
    if (!editorState && !isEdit) {
      const load = typeof listIndex === "number" ? section.list[listIndex].text : section.text
      if (load) {
        setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(load))))
      } else {
        setEditorState(EditorState.createEmpty())
      }
    }
  }, [section, editorState, setEditorState, isEdit])

  useEffect(() => {
    if (!selectedSection) {
      if (editorRef?.current) {
        ;(editorRef?.current as any).blur()
      }
    }
  }, [selectedSection, editorRef?.current])

  console.log(section.text)

  return (
    editorState && (
      <div className={cx("text-wrapper")}>
        <Toolbar
          setIsEdit={setIsEdit}
          setEditorState={setEditorState}
          textColor={textColor}
          editorState={editorState}
        />
        <div style={{ color: textColor ?? colors.black }} className={cx("container", "text-global-style")}>
          <Editor
            ref={editorRef}
            handleKeyCommand={handleKeyCommand}
            editorState={editorState}
            customStyleMap={editorStyleMap}
            blockStyleFn={myBlockStyleFn}
            onChange={onChangeEditor}
          />
        </div>
      </div>
    )
  )
}

export default memo(Text)
