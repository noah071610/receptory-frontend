"use client"

import { SectionType } from "@/types/Edit"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { memo } from "react"
import Text from "../Text"
import style from "./style.module.scss"
const cx = classNames.bind(style)

function Callout({ section }: { section: SectionType }) {
  return (
    <div className={cx(style["layout"])}>
      <div className={cx(style.callout)}>
        <div className={cx(style["image-container"])}>
          <button>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        <div className={cx(style.main)}>
          <Text section={section} />
        </div>
      </div>
    </div>
  )
}

export default memo(Callout)
