"use client"

import ImageDelete from "@/components/ImageDelete"
import Input from "@/components/Input"
import Textarea from "@/components/Textarea"
import { getImageUrl } from "@/config"
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

export default function Full({
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

  const { setActive } = useEditorStore()

  const onClickThumbnailUpload = () => {
    setActive({ key: "modal", payload: { type: "thumbnail-image" } })
  }

  const mainBackground = background
    ? // 풀 타입 배경 화면
      getImageUrl({ isCenter: true, url: background ?? "" })
    : // 풀 타입 백그라운드 컬러
      `linear-gradient(180deg, ${backgroundColor} 87%, rgba(0,0,0,0) 100%)`

  return (
    <div
      style={{
        background: mainBackground,
      }}
      className={cx("wrapper", { isDisplayMode })}
    >
      {background && !isDisplayMode && <ImageDelete srcKey={"background"} />}
      <div className={cx("main")}>
        <picture className={cx("thumbnail", isDisplayMode && "isDisplayMode")}>
          {hasString(section.src) && <img src={section.src} alt="image" />}
          {section.src && !isDisplayMode && <ImageDelete srcKey={"thumbnail"} />}
          {!isDisplayMode && (
            <button className={cx("drop-zone")} onClick={onClickThumbnailUpload}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          )}
        </picture>
        <Input
          section={section}
          className={cx(!isDisplayMode && "title-input")}
          inputType="title"
          displayMode={isDisplayMode && "h1"}
          isOptional={true}
          dataKey="title"
          style={{ color: textColor }}
          value={title}
        />
        <Textarea
          section={section}
          className={cx(!isDisplayMode && "description-input")}
          inputType="description"
          displayMode={isDisplayMode && "p"}
          isOptional={true}
          dataKey="description"
          style={{ color: textColor }}
          value={description}
        />
        <div className={cx("cta-wrapper")}>
          <button style={{ backgroundColor: color }} className={cx("cta")}>
            <Input
              section={section}
              displayMode={isDisplayMode && "span"}
              inputType="cta"
              dataKey="cta"
              isOptional={false}
              style={{ color: ctaTextColor }}
              value={cta}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
