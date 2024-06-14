"use client"

import DeleteBtn from "@/components/DeleteBtn"
import Input from "@/components/Input"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { PageStage } from "@/types/Main"
import { getImageUrl } from "@/utils/helpers/getImageUrl"
import hasString from "@/utils/helpers/hasString"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classnames/bind"
import { useCallback } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function Card({
  section,
  ctaTextColor,
  textColor,
  borderColor,
  isDisplayMode,
  setPageStage,
  isButtonVisible,
  imageStatus,
}: {
  ctaTextColor: string
  textColor: string
  borderColor: string
  section: SectionType
  isDisplayMode?: boolean
  setPageStage?: (type: PageStage) => void
  isButtonVisible: boolean
  imageStatus: "image" | "emoji"
}) {
  const onClickCTA = useCallback(() => {
    setPageStage && setPageStage("form")
  }, [setPageStage])

  const { title, description, cta } = section.data
  const { color, background, backgroundColor } = section.style

  const { setActive } = useEditorStore(["setActive"])

  const onClickThumbnailUpload = () => {
    setActive({ key: "modal", payload: { type: "thumbnail-image" } })
  }

  return (
    <div className={cx("wrapper")}>
      {background && !isDisplayMode && <DeleteBtn srcKey={"background"} />}
      <div style={{ borderColor }} className={cx("main")}>
        {!isDisplayMode && (
          <div style={{ background: getImageUrl({ url: section.src }) }} className={cx("thumbnail", imageStatus)}>
            {hasString(section.src) && !isDisplayMode && <DeleteBtn isSmall={true} srcKey={"thumbnail"} />}
            <button className={cx("drop-zone")} onClick={onClickThumbnailUpload}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        )}
        {isDisplayMode && hasString(section.src) && (
          <picture className={cx("thumbnail", "display", imageStatus)}>
            <img src={section.src} alt="image" />
          </picture>
        )}
        <Input
          type="input"
          inputType="titleInput"
          className={cx(!isDisplayMode && "title-input")}
          displayMode={isDisplayMode && "h1"}
          isOptional={false}
          dataKey={"title"}
          style={{ color: textColor }}
          value={title}
          section={section}
        />
        <Input
          type="textarea"
          inputType="descriptionInput"
          className={cx(!isDisplayMode && "description-input")}
          displayMode={isDisplayMode && "p"}
          isOptional={true}
          dataKey={"description"}
          style={{ color: textColor }}
          value={description}
          section={section}
        />
        {isButtonVisible && (
          <div className={cx("cta-wrapper")}>
            <button
              onClick={setPageStage ? onClickCTA : undefined}
              style={{ backgroundColor: color }}
              className={cx("cta")}
            >
              <Input
                type="input"
                displayMode={isDisplayMode && "span"}
                inputType="textInput"
                dataKey={"cta"}
                isOptional={false}
                style={{ color: ctaTextColor }}
                value={cta}
                section={section}
              />
            </button>
          </div>
        )}
      </div>

      <div
        style={{
          background: background ? getImageUrl({ url: background ?? "" }) : backgroundColor,
        }}
        className={cx("background")}
      />
    </div>
  )
}
