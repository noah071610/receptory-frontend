import { bgColorArr, textColorArr } from "./colors"

// FOR INLINE STYLES
export const textEditorModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ align: ["right", "center", "justify"] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [
      {
        color: textColorArr,
      },
    ],
    [{ background: bgColorArr }],
  ],
}

export const textEditorFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "color",
  "background",
  "align",
  "size",
]
