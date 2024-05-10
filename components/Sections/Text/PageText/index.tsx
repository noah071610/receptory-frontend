"use client"

import { colors } from "@/config/colors"
import cs from "classNames/bind"
import { Editor, EditorState } from "draft-js"
import { memo } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

function PageText({ textState, textColor }: { textState: any; textColor?: string }) {
  return (
    <div className={cx("text-wrapper")}>
      <div style={{ color: textColor ?? colors.black }} className={cx("container", "text-global-style")}>
        <Editor
          editorState={EditorState.createWithContent(textState.getCurrentContent())}
          onChange={() => {}}
          readOnly={true}
        />
      </div>
    </div>
  )
}

export default memo(PageText)
