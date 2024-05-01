"use client"

import { getImageUrl } from "@/config"
import { colors } from "@/config/colors"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import getContrastTextColor from "@/utils/getContrastTextColor"
import hasString from "@/utils/hasString"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { memo, useMemo } from "react"
import Text from "../Text"
import style from "./style.module.scss"
const cx = classNames.bind(style)

function Callout({ section }: { section: SectionType }) {
  const { setActive } = useEditorStore()
  const textColor = useMemo(
    () => getContrastTextColor(section.style.backgroundColor ?? colors.white),
    [section.style.backgroundColor]
  )

  const onClickAddImage = () => {
    setActive({ key: "modal", payload: { type: "callout-image" } })
  }

  return (
    <div className={cx(style["layout"])}>
      <div style={section.style} className={cx(style.callout)}>
        <div className={cx(style["image-container"])}>
          <button
            style={{ background: getImageUrl({ isCenter: true, url: section.src ?? "" }) }}
            onClick={onClickAddImage}
            className={cx({ [style["has-image"]]: hasString(section.src) })}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        <div className={cx(style.main)}>
          <Text textColor={textColor} section={section} />
        </div>
      </div>
    </div>
  )
}

export default memo(Callout)
