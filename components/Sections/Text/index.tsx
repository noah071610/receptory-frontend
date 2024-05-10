// @ts-ignore
import { ContentBlock, DraftHandleValue, Editor, EditorState, RichUtils } from "draft-js"
import { memo, useCallback, useEffect, useRef, useState } from "react"

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
  const editorRef = useRef(null)
  const editorState = typeof listIndex === "number" ? section.list[listIndex].text : section.text
  const [isEdit, setIsEdit] = useState(false)

  const setTextByType = useCallback(
    (editorState: any) => {
      if (typeof listIndex === "number") {
        setList({ index: listIndex, key: "text", payload: editorState })
      } else {
        setText({ payload: editorState })
      }
      setIsEdit(true)
    },
    [listIndex]
  )

  const onChangeEditor = useCallback((editorState: any) => {
    setTextByType(editorState)
  }, [])

  const handleKeyCommand = (command: string, editorState: EditorState): DraftHandleValue => {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      setTextByType(newState)
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
    if (!selectedSection) {
      if (editorRef?.current) {
        ;(editorRef?.current as any).blur()
      }
    }
  }, [selectedSection, editorRef?.current])

  const onBlurInput = () => {
    if (isEdit) {
      saveSectionHistory({ payload: section })
      setIsEdit(false)
    }
  }
  return (
    <div className={cx("text-wrapper")}>
      <Toolbar section={section} textColor={textColor} editorState={editorState} listIndex={listIndex} />
      <div style={{ color: textColor ?? colors.black }} className={cx("container", "text-global-style")}>
        <Editor
          ref={editorRef}
          handleKeyCommand={handleKeyCommand}
          editorState={editorState}
          customStyleMap={editorStyleMap}
          blockStyleFn={myBlockStyleFn}
          onBlur={onBlurInput}
          onChange={onChangeEditor}
        />
      </div>
    </div>
  )
}

export default memo(Text)
