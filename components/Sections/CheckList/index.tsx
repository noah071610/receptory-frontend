"use client"

import { getImageUrl } from "@/config"
import { changeOpacity } from "@/config/colors"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import hasString from "@/utils/hasString"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { memo, useMemo } from "react"
import Text from "../Text"
import style from "./style.module.scss"
const cx = classNames.bind(style)

function Callout({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { setActive } = useEditorStore()
  const { color } = section.style

  const backgroundColor = useMemo(() => changeOpacity(color ?? "rgba(255,255,255,1)", 0.1), [color])

  // const textColor = useMemo(() => getContrastTextColor(backgroundColor ?? colors.black), [backgroundColor])

  const onClickAddImage = () => {
    setActive({ key: "modal", payload: { type: "callout-image" } })
  }

  return (
    <div className={cx(style["layout"])}>
      <div style={{ backgroundColor, borderColor: color }} className={cx(style.callout)}>
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
          <Text section={section} />
        </div>
      </div>
    </div>
  )
}

export default memo(Callout)
