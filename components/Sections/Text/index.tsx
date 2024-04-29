// @ts-ignore
import { ContentBlock, DraftHandleValue, Editor, EditorState, RichUtils } from "draft-js"
import { memo, useEffect, useRef } from "react"

import Toolbar from "./Toolbar"

import { colors } from "@/config/colors"
import { editorStyleMap } from "@/config/edit"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const Text = ({ section, textColor, listIndex }: { section: SectionType; textColor?: string; listIndex?: number }) => {
  const { selectedSection, setText, setList, setSelectedSection } = useEditorStore()
  const editor = useRef(null)
  const editorState = typeof listIndex === "number" ? section.list[listIndex].text : section.text
  const setTextByType = (editorState: any) => {
    if (typeof listIndex === "number") {
      setList({ index: listIndex, key: "text", payload: editorState })
    } else {
      setText({ payload: editorState })
    }
  }
  const onChangeEditor = (editorState: any) => {
    if (selectedSection?.id !== section.id) {
      setSelectedSection({ payload: section })
    }
    setTextByType(editorState)
  }

  useEffect(() => {
    focusEditor()
  }, [])

  const focusEditor = () => {
    if (editor?.current) {
      ;(editor.current as any).focus()
    }
  }

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

  return (
    <div className={cx(style.editor)} onClick={focusEditor}>
      <Toolbar textColor={textColor} editorState={editorState} listIndex={listIndex} />
      <div style={{ color: textColor ?? colors.blackSoft }} className={cx(style.container)}>
        <Editor
          ref={editor}
          handleKeyCommand={handleKeyCommand}
          editorState={editorState}
          customStyleMap={editorStyleMap}
          blockStyleFn={myBlockStyleFn}
          onChange={onChangeEditor}
        />
      </div>
    </div>
  )
}

export default memo(Text)
