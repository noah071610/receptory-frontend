// @ts-ignore
import { ContentBlock, DraftHandleValue, Editor, EditorState, RichUtils } from "draft-js"
import { memo, useCallback } from "react"

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

  const editorState = typeof listIndex === "number" ? section.list[listIndex].text : section.text

  const getCurSection = () => {
    if (selectedSection?.id !== section.id) {
      setSelectedSection({ payload: section })
    }
  }
  const setTextByType = useCallback(
    (editorState: any) => {
      getCurSection()
      if (typeof listIndex === "number") {
        setList({ index: listIndex, key: "text", payload: editorState })
      } else {
        setText({ payload: editorState })
      }
    },
    [listIndex]
  )

  const onChangeEditor = useCallback((editorState: any) => {
    getCurSection()
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

  return (
    <div className={cx(style.editor)}>
      <Toolbar section={section} textColor={textColor} editorState={editorState} listIndex={listIndex} />
      <div style={{ color: textColor ?? colors.blackSoft }} className={cx(style.container)}>
        <Editor
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
