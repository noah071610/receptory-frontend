import {
  faAlignCenter,
  faAlignLeft,
  faAlignRight,
  faBold,
  faHighlighter,
  faItalic,
  faListOl,
  faListUl,
  faQuoteRight,
  faStrikethrough,
  faTextWidth,
  faUnderline,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// @ts-ignore
import classNames from "classNames"
import { RichUtils } from "draft-js"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const tools = [
  {
    label: "bold",
    style: "BOLD",
    icon: <FontAwesomeIcon icon={faBold} />,
    method: "inline",
  },
  {
    label: "italic",
    style: "ITALIC",
    icon: <FontAwesomeIcon icon={faItalic} />,
    method: "inline",
  },
  {
    label: "underline",
    style: "UNDERLINE",
    icon: <FontAwesomeIcon icon={faUnderline} />,
    method: "inline",
  },
  {
    label: "highlight",
    style: "HIGHLIGHT",
    icon: <FontAwesomeIcon icon={faHighlighter} />,
    method: "inline",
  },
  {
    label: "strike-through",
    style: "STRIKETHROUGH",
    icon: <FontAwesomeIcon icon={faStrikethrough} />,
    method: "inline",
  },
  {
    label: "Monospace",
    style: "CODE",
    icon: <FontAwesomeIcon icon={faTextWidth} transform="grow-3" />,
    method: "inline",
  },
  {
    label: "Blockquote",
    style: "blockQuote",
    icon: <FontAwesomeIcon icon={faQuoteRight} transform="grow-2" />,
    method: "block",
  },
  {
    label: "Unordered-List",
    style: "unordered-list-item",
    method: "block",
    icon: <FontAwesomeIcon icon={faListUl} transform="grow-6" />,
  },
  {
    label: "Ordered-List",
    style: "ordered-list-item",
    method: "block",
    icon: <FontAwesomeIcon icon={faListOl} transform="grow-6" />,
  },
  {
    label: "Left",
    style: "leftAlign",
    icon: <FontAwesomeIcon icon={faAlignLeft} transform="grow-2" />,
    method: "block",
  },
  {
    label: "Center",
    style: "centerAlign",
    icon: <FontAwesomeIcon icon={faAlignCenter} transform="grow-2" />,
    method: "block",
  },
  {
    label: "Right",
    style: "rightAlign",
    icon: <FontAwesomeIcon icon={faAlignRight} transform="grow-2" />,
    method: "block",
  },
  { label: "H1", style: "header-one", method: "block" },
  { label: "H2", style: "header-two", method: "block" },
  { label: "H3", style: "header-three", method: "block" },
]

const Toolbar = ({ editorState, setEditorState }: { editorState: any; setEditorState: any }) => {
  const applyStyle = (e: any, style: any, method: any) => {
    e.preventDefault()
    method === "block"
      ? setEditorState(RichUtils.toggleBlockType(editorState, style))
      : setEditorState(RichUtils.toggleInlineStyle(editorState, style))
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
            color: isActive(item.style, item.method) ? "rgba(0, 0, 0, 1)" : "rgba(0, 0, 0, 0.3)",
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
