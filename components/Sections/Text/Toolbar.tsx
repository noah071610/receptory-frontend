// @ts-ignore
import { colors } from "@/config/colors"
import { tools } from "@/config/edit"
import { useEditorStore } from "@/store/editor"
import classNames from "classNames"
import { RichUtils } from "draft-js"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const Toolbar = ({
  editorState,
  textColor,
  listIndex,
}: {
  editorState: any
  textColor?: string
  listIndex?: number
}) => {
  const { setList, setText } = useEditorStore()
  const applyStyle = (e: any, style: any, method: any) => {
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

  const isActive = (style: any, method: any) => {
    if (method === "block") {
      const selection = editorState.getSelection()
      const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType()
      return blockType === style
    } else {
      const currentStyle = editorState.getCurrentInlineStyle()
      return currentStyle.has(style)
    }
  }

  return (
    <div className={cx(style["toolbar-grid"])}>
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
