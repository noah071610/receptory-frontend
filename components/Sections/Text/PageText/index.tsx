"use client"

import { colors } from "@/config/colors"
import hasString from "@/utils/helpers/hasString"
import cs from "classNames/bind"
import { Editor, EditorState, convertFromRaw } from "draft-js"
import { memo, useEffect, useState } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

function PageText({ text, textColor }: { text: string; textColor?: string }) {
  const [state, setState] = useState(EditorState.createEmpty())

  useEffect(() => {
    console.log(text)
    if (hasString(text)) setState(EditorState.createWithContent(convertFromRaw(JSON.parse(text))))
  }, [text])

  return (
    <div className={cx("text-wrapper")}>
      <div style={{ color: textColor ?? colors.black }} className={cx("container", "text-global-style")}>
        <Editor editorState={state} onChange={() => {}} readOnly={true} />
      </div>
    </div>
  )
}

export default memo(PageText)
