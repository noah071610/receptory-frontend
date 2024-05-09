"use client"

import DeleteBtn from "@/components/DeleteBtn"
import Input from "@/components/Input"
import { getImageUrl } from "@/config"
import { colors } from "@/config/colors"
import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import hasString from "@/utils/hasString"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import { useParams } from "next/navigation"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function Background({
  section,
  textColor,
  ctaTextColor,
  isDisplayMode,
}: {
  textColor: string
  ctaTextColor: string
  section: SectionType
  isDisplayMode?: boolean
}) {
  const { lang } = useParams()
  const { t } = useTranslation(lang, ["new-post-page"])
  const { title, description, cta } = section.data
  const { color, background, backgroundColor } = section.style

  const { setActive, stage } = useEditorStore()
  const isForm = stage === "form"

  const onClickThumbnailUpload = () => {
    setActive({ key: "modal", payload: { type: "thumbnail-image" } })
  }

  return (
    <div className={cx("wrapper")}>
      <div
        style={{
          background: background ? getImageUrl({ isCenter: true, url: background ?? "" }) : backgroundColor,
          filter: background ? "brightness(60%)" : "none",
        }}
        className={cx("background")}
      ></div>
      {background && !isDisplayMode && <DeleteBtn srcKey={"background"} />}

      <div className={cx("content")}>
        {!isDisplayMode && (
          <div style={{ background: getImageUrl({ isCenter: true, url: section.src }) }} className={cx("thumbnail")}>
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
          inputType="title"
          className={cx(!isDisplayMode && "title-input")}
          displayMode={isDisplayMode && "h1"}
          isOptional={true}
          dataKey={"title"}
          value={title}
          style={{ color: hasString(background) ? colors.white : textColor }}
        />
        <Input
          type="textarea"
          inputType="description"
          className={cx(!isDisplayMode && "description-input")}
          displayMode={isDisplayMode && "p"}
          isOptional={true}
          dataKey={"description"}
          value={description}
          style={{ color: hasString(background) ? colors.white : textColor }}
        />
        {!isForm && (
          <div className={cx("cta-wrapper")}>
            <button style={{ backgroundColor: color }} className={cx("cta")}>
              <Input
                type="input"
                displayMode={isDisplayMode && "span"}
                inputType="cta"
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
