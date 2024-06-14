"use client"

import DeleteBtn from "@/components/DeleteBtn"
import Input from "@/components/Input"
import { colors } from "@/config/colors"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { PageStage } from "@/types/Main"
import { getImageUrl } from "@/utils/helpers/getImageUrl"
import hasString from "@/utils/helpers/hasString"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import { useCallback } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function Background({
  section,
  textColor,
  ctaTextColor,
  isDisplayMode,
  setPageStage,
  isButtonVisible,
  imageStatus,
}: {
  textColor: string
  ctaTextColor: string
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
      <div
        style={{
          background: background ? getImageUrl({ url: background ?? "" }) : backgroundColor,
          filter: background ? "brightness(60%)" : "none",
        }}
        className={cx("background")}
      ></div>
      {background && !isDisplayMode && <DeleteBtn srcKey={"background"} />}

      <div className={cx("content", imageStatus)}>
        {!isDisplayMode && (
          <div style={{ background: getImageUrl({ url: section.src }) }} className={cx("thumbnail")}>
            {hasString(section.src) && !isDisplayMode && <DeleteBtn isSmall={true} srcKey={"thumbnail"} />}
            <button className={cx("drop-zone")} onClick={onClickThumbnailUpload}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        )}
        {isDisplayMode && hasString(section.src) && (
          <picture className={cx("thumbnail", "display")}>
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
          value={title}
          section={section}
          style={{ color: hasString(background) ? colors.white : textColor }}
        />
        <Input
          type="textarea"
          inputType="descriptionInput"
          className={cx(!isDisplayMode && "description-input")}
          displayMode={isDisplayMode && "p"}
          isOptional={true}
          dataKey={"description"}
          value={description}
          section={section}
          style={{ color: hasString(background) ? colors.white : textColor }}
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
                section={section}
                displayMode={isDisplayMode && "span"}
                inputType="textInput"
                dataKey={"cta"}
                isOptional={false}
                style={{ color: ctaTextColor }}
                value={cta}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
