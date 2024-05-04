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

// FOR INLINE STYLES
export const editorStyleMap = {
  HIGHLIGHT: {
    backgroundColor: "rgba(254, 225, 39, 0.5)",
  },
  SUPERSCRIPT: {
    verticalAlign: "super",
    fontSize: "80%",
  },
  SUBSCRIPT: {
    verticalAlign: "sub",
    fontSize: "80%",
  },
}

export const tools = [
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
