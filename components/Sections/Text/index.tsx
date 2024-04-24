// @ts-ignore
import { ContentBlock, DraftHandleValue, Editor, EditorState, RichUtils } from "draft-js"
import { memo, useEffect, useRef, useState } from "react"

import Toolbar from "./Toolbar"

import { colors } from "@/config/colors"
import { editorStyleMap } from "@/config/edit"
import { SectionListType, SectionType } from "@/types/Edit"
import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const Text = ({ section, textColor }: { section: SectionType | SectionListType; textColor?: string }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const editor = useRef(null)

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

  console.log(textColor)

  return (
    <div className={cx(style.editor)} onClick={focusEditor}>
      <Toolbar textColor={textColor} editorState={editorState} setEditorState={setEditorState} />
      <div style={{ color: textColor ?? colors.blackSoft }} className={cx(style.container)}>
        <Editor
          ref={editor}
          handleKeyCommand={handleKeyCommand}
          editorState={editorState}
          customStyleMap={editorStyleMap}
          blockStyleFn={myBlockStyleFn}
          onChange={(editorState: any) => {
            setEditorState(editorState)
          }}
        />
      </div>
    </div>
  )
}

export default memo(Text)
