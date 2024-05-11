"use client"

import DeleteBtn from "@/components/DeleteBtn"
import Input from "@/components/Input"
import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { getImageUrl } from "@/utils/helpers/getImageUrl"
import hasString from "@/utils/helpers/hasString"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import { useParams } from "next/navigation"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function Card({
  section,
  ctaTextColor,
  textColor,
  borderColor,
  isDisplayMode,
}: {
  ctaTextColor: string
  textColor: string
  borderColor: string
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
      {background && !isDisplayMode && <DeleteBtn srcKey={"background"} />}
      <div style={{ borderColor }} className={cx("main")}>
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
          inputType="title"
          className={cx(!isDisplayMode && "title-input")}
          displayMode={isDisplayMode && "h1"}
          isOptional={true}
          dataKey={"title"}
          style={{ color: textColor }}
          value={title}
          section={section}
        />
        <Input
          type="textarea"
          inputType="description"
          className={cx(!isDisplayMode && "description-input")}
          displayMode={isDisplayMode && "p"}
          isOptional={true}
          dataKey={"description"}
          style={{ color: textColor }}
          value={description}
          section={section}
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
