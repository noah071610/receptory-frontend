// @ts-ignore
import { memo } from "react"

import { colors } from "@/config/colors"
import { SectionType } from "@/types/Edit"
import classNames from "classNames"
import { stateToHTML } from "draft-js-export-html"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const Text = ({ section, textColor, listIndex }: { section: SectionType; textColor?: string; listIndex?: number }) => {
  return (
    <div className={cx(style.editor)}>
      <div
        dangerouslySetInnerHTML={{
          __html:
            typeof listIndex === "number"
              ? stateToHTML(section.list[listIndex].text.getCurrentContent())
              : stateToHTML(section.text.getCurrentContent()),
        }}
        style={{ color: textColor ?? colors.blackSoft }}
        className={cx(style.container)}
      ></div>
    </div>
  )
}

export default memo(Text)
