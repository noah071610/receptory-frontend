"use client"

import DeleteBtn from "@/components/DeleteBtn"

import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import hasString from "@/utils/helpers/hasString"
import { changeOpacity } from "@/utils/styles/changeOpacity"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classnames/bind"
import dynamic from "next/dynamic"
import Image from "next/image"
import { memo, useMemo } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

const PageText = dynamic(() => import("../Text/PageText"), {
  ssr: true,
})
const Text = dynamic(() => import("../Text"), {
  ssr: true,
})

function Callout({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { setActive } = useEditorStore(["setActive"])
  const { color } = section.style
  const design = section.design

  const backgroundColor = useMemo(() => changeOpacity(color ?? "rgba(255,255,255,1)", 0.1), [color])

  const imageStatus = section.options.imageStatus

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
            className={cx("image-container", imageStatus ? imageStatus : "")}
          >
            {section.src && !isDisplayMode && <DeleteBtn isSmall={true} srcKey="callout" />}
            <picture className={cx("image")}>
              {section.src && <Image width={50} height={50} src={section.src} alt="image" />}
              {!isDisplayMode && (
                <button onClick={onClickAddImage} className={cx("image-btn", { ["has-image"]: section.src })}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              )}
            </picture>
          </div>
        )}
        <div className={cx("main")}>
          {isDisplayMode ? <PageText text={section.value} /> : <Text section={section} />}
        </div>
      </div>
    </div>
  )
}

export default memo(Callout)
