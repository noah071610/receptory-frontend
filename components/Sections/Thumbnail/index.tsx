"use client"

import ImageDelete from "@/components/ImageDelete"
import Input from "@/components/Input"
import Textarea from "@/components/Textarea"
import { getImageUrl } from "@/config"
import { colors } from "@/config/colors"
import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import getContrastTextColor from "@/utils/getContrastTextColor"
import hasString from "@/utils/hasString"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { useParams } from "next/navigation"
import { useMemo } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function Thumbnail({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { lang } = useParams()
  const { t } = useTranslation(lang, ["new-post-page"])

  const { setActive } = useEditorStore()

  const [title, description, cta] = section.list
  const ctaStyle = section.list[2].style
  const design = section.design
  const { background, backgroundColor } = section.style

  const ctaTextColor = useMemo(
    () => getContrastTextColor(ctaStyle.backgroundColor ?? colors.blackSoft),
    [ctaStyle.backgroundColor]
  )
  const textColor = useMemo(
    () => (design === "card" ? colors.black : getContrastTextColor(backgroundColor ?? colors.white)),
    [backgroundColor, design]
  )

  const onClickThumbnailUpload = () => {
    setActive({ key: "modal", payload: { type: "thumbnail-image" } })
  }

  return (
    <div
      style={{
        background:
          design === "card"
            ? colors.white
            : background
              ? getImageUrl({ isCenter: true, url: background ?? "" })
              : `linear-gradient(180deg, ${backgroundColor} 87%, rgba(0,0,0,0) 100%)`,
      }}
      className={cx(style.wrapper, style[design])}
    >
      {background && !isDisplayMode && <ImageDelete section={section} srcKey={"background"} />}
      <div className={cx(style.main, style[design])}>
        <picture
          className={cx(style.thumbnail, style[design], {
            [style.isDisplayMode]: isDisplayMode,
            [style["noImage-displayMode"]]: !hasString(section.src) && isDisplayMode,
          })}
        >
          {hasString(section.src) && <img src={section.src} alt="image" />}
          {section.src && !isDisplayMode && <ImageDelete section={section} srcKey={"thumbnail"} />}
          {!isDisplayMode && (
            <button className={cx(style["drop-zone"])} onClick={onClickThumbnailUpload}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          )}
        </picture>
        <Input
          section={section}
          className={cx(style.title, isDisplayMode ? "" : style["title-input"])}
          inputType="title"
          displayMode={isDisplayMode && "h1"}
          isOptional={true}
          listIndex={0}
          style={{ color: textColor }}
          value={title.value}
        />
        <Textarea
          section={section}
          className={cx(style.description, isDisplayMode ? "" : style["description-input"])}
          inputType="description"
          displayMode={isDisplayMode && "p"}
          isOptional={true}
          listIndex={1}
          style={{ color: textColor }}
          value={description.value}
        />
        <div className={cx(style["cta-wrapper"])}>
          <button style={{ backgroundColor: ctaStyle.backgroundColor }} className={cx(style.cta)}>
            <Input
              section={section}
              displayMode={isDisplayMode && "span"}
              inputType="cta"
              listIndex={2}
              isOptional={false}
              style={{ color: ctaTextColor }}
              value={cta.value}
            />
          </button>
        </div>
      </div>

      {design === "full" && (
        <div className={cx(style.arrow)}>
          <a href="#">
            <span></span>
            <span></span>
            <span></span>
          </a>
        </div>
      )}

      {design === "card" && (
        <div
          style={{
            background: background ? getImageUrl({ isCenter: true, url: background ?? "" }) : backgroundColor,
          }}
          className={cx(style.background)}
        />
      )}
    </div>
  )
}
