"use client"

import DeleteBtn from "@/components/DeleteBtn"
import { changeOpacity } from "@/config/colors"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import hasString from "@/utils/hasString"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import Image from "next/image"
import { memo, useMemo } from "react"
import Text from "../Text"
import style from "./style.module.scss"
const cx = cs.bind(style)

function Callout({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { setActive } = useEditorStore()
  const { color } = section.style
  const design = section.design

  const backgroundColor = useMemo(() => changeOpacity(color ?? "rgba(255,255,255,1)", 0.1), [color])

  // const textColor = useMemo(() => getContrastTextColor(backgroundColor ?? colors.black), [backgroundColor])

  const onClickAddImage = () => {
    setActive({ key: "modal", payload: { type: "callout-image" } })
  }

  return (
    <div className={cx("layout")}>
      <div
        style={{ backgroundColor, borderColor: design === "card" ? "transparent" : color }}
        className={cx("callout", design)}
      >
        {design !== "none" && (!isDisplayMode || (isDisplayMode && hasString(section.src))) && (
          <div
            style={
              design === "card" ? { backgroundColor: changeOpacity(backgroundColor, 0.3), borderColor: color } : {}
            }
            className={cx("image-container")}
          >
            {section.src && !isDisplayMode && <DeleteBtn isSmall={true} srcKey="callout" />}
            <picture onClick={onClickAddImage} className={cx("image")}>
              {section.src && <Image width={50} height={50} src={section.src} alt="image" />}
              {!isDisplayMode && (
                <button className={cx("image-btn", { ["has-image"]: hasString(section.src) })}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              )}
            </picture>
          </div>
        )}
        <div className={cx("main")}>
          <Text section={section} isDisplayMode={isDisplayMode} />
        </div>
      </div>
    </div>
  )
}

export default memo(Callout)
