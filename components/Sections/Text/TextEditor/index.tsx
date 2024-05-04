// @ts-ignore
import { ContentBlock, DraftHandleValue, Editor, EditorState, RichUtils } from "draft-js"
import { memo, useCallback, useEffect, useRef, useState } from "react"

import Toolbar from "./Toolbar"

import { colors } from "@/config/colors"
import { editorStyleMap } from "@/config/edit"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import classNames from "classNames"
import style from "../style.module.scss"
const cx = classNames.bind(style)

const TextEditor = ({
  section,
  textColor,
  listIndex,
  isDisplayMode,
}: {
  section: SectionType
  textColor?: string
  listIndex?: number
  isDisplayMode?: boolean
}) => {
  const { selectedSection, setText, setList, saveSectionHistory } = useEditorStore()
  const editorRef = useRef(null)
  const editorState = typeof listIndex === "number" ? section.list[listIndex].text : section.text
  const [isEdit, setIsEdit] = useState(false)
  const displayModeEditorState = EditorState.createWithContent(editorState.getCurrentContent())

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
        return style["superFancyBlockquote"]
      case "leftAlign":
        return style["leftAlign"]
      case "rightAlign":
        return style["rightAlign"]
      case "centerAlign":
        return style["centerAlign"]
      case "justifyAlign":
        return style["justifyAlign"]
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
    <>
      {!isDisplayMode && (
        <Toolbar section={section} textColor={textColor} editorState={editorState} listIndex={listIndex} />
      )}
      <div style={{ color: textColor ?? colors.black }} className={cx(style.container, style["text-global-style"])}>
        <Editor
          ref={editorRef}
          handleKeyCommand={handleKeyCommand}
          editorState={isDisplayMode ? displayModeEditorState : editorState}
          customStyleMap={editorStyleMap}
          blockStyleFn={myBlockStyleFn}
          onBlur={onBlurInput}
          onChange={isDisplayMode ? () => {} : onChangeEditor}
          readOnly={!!isDisplayMode}
        />
      </div>
    </>
  )
}

export default memo(TextEditor)
