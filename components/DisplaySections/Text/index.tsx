// @ts-ignore
import { Editor } from "draft-js"
import { memo } from "react"

import { SectionListType, SectionType } from "@/types/Edit"
import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const Text = ({ section, textColor }: { section: SectionType | SectionListType; textColor?: string }) => {
  return (
    <div className={cx(style.editor)}>
      <div className={cx(style.container)}>
        <Editor editorState={section.value} onChange={() => {}} readOnly={true} />
      </div>
    </div>
  )
}

export default memo(Text)
