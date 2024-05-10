// @ts-ignore
import { colors } from "@/config/colors"
import { tools } from "@/config/edit"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import cs from "classNames/bind"
import { RichUtils } from "draft-js"
import { useCallback } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

const Toolbar = ({
  editorState,
  textColor,
  listIndex,
  section,
}: {
  editorState: any
  textColor?: string
  listIndex?: number
  section: SectionType
}) => {
  const { setList, setText, selectedSection, setSelectedSection } = useEditorStore()
  const applyStyle = (e: any, style: any, method: any) => {
    if (selectedSection?.id !== section.id) {
      setSelectedSection({ payload: section })
    }
    e.preventDefault()
    if (method === "block") {
      if (typeof listIndex === "number") {
        setList({ index: listIndex, key: "text", payload: RichUtils.toggleBlockType(editorState, style) })
      } else {
        setText({ payload: RichUtils.toggleBlockType(editorState, style) })
      }
    } else {
      if (typeof listIndex === "number") {
        setList({ index: listIndex, key: "text", payload: RichUtils.toggleInlineStyle(editorState, style) })
      } else {
        setText({ payload: RichUtils.toggleInlineStyle(editorState, style) })
      }
    }
    // method === "block"
    //   ? setEditorState(RichUtils.toggleBlockType(editorState, style))
    //   : setEditorState(RichUtils.toggleInlineStyle(editorState, style))
  }

  const isActive = useCallback(
    (style: any, method: any) => {
      if (method === "block") {
        const selection = editorState.getSelection()
        const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType()
        return blockType === style
      } else {
        const currentStyle = editorState.getCurrentInlineStyle()
        return currentStyle.has(style)
      }
    },
    [editorState]
  )

  return (
    <div className={cx("toolbar-grid")}>
      {tools.map((item, idx) => (
        <button
          style={{
            color:
              textColor !== colors.white
                ? isActive(item.style, item.method)
                  ? "rgba(0, 0, 0, 1)"
                  : "rgba(0, 0, 0, 0.3)"
                : isActive(item.style, item.method)
                  ? "rgba(255, 255, 255, 1)"
                  : "rgba(255, 255, 255, 0.6)",
          }}
          key={`${item.label}-${idx}`}
          title={item.label}
          onClick={(e) => applyStyle(e, item.style, item.method)}
          onMouseDown={(e) => e.preventDefault()}
        >
          {item.icon || item.label}
        </button>
      ))}
    </div>
  )
}

export default Toolbar
