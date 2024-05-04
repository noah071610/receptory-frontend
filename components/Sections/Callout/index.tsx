"use client"

import { changeOpacity } from "@/config/colors"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import hasString from "@/utils/hasString"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import Image from "next/image"
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
          <picture onClick={onClickAddImage} className={cx(style.image)}>
            {section.src && <Image width={50} height={50} src={section.src} alt="image" />}
            {!isDisplayMode && (
              <button className={cx(style["image-btn"], { [style["has-image"]]: hasString(section.src) })}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            )}
          </picture>
        </div>
        <div className={cx(style.main)}>
          <Text section={section} isDisplayMode={isDisplayMode} />
        </div>
      </div>
    </div>
  )
}

export default memo(Callout)
