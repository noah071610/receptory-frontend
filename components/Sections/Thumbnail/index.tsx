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
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { useParams } from "next/navigation"
import { useMemo } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function Thumbnail({ section }: { section: SectionType }) {
  const { lang } = useParams()

  const { setActive } = useEditorStore()
  const { t } = useTranslation(lang, ["new-post-page"])

  const title = section.list[0]

  const description = section.list[1]

  const cta = section.list[2]
  const ctaStyle = section.list[2].style

  const ctaTextColor = useMemo(
    () => getContrastTextColor(ctaStyle.backgroundColor ?? colors.blackSoft),
    [ctaStyle.backgroundColor]
  )
  const textColor = useMemo(
    () => getContrastTextColor(section.style.backgroundColor ?? colors.white),
    [section.style.backgroundColor]
  )

  const onClickThumbnailUpload = () => {
    setActive({ key: "modal", payload: "thumbnail" })
  }

  return (
    <div
      style={{
        background: section.style.background
          ? getImageUrl({ isCenter: true, url: section.style.background ?? "" })
          : `linear-gradient(180deg, ${section.style.backgroundColor} 87%, rgba(0,0,0,0) 100%)`,
      }}
      className={cx(style.wrapper)}
    >
      {section.style.background && <ImageDelete section={section} srcKey={"background"} />}
      <div className={cx(style.main)}>
        <div
          style={{ background: getImageUrl({ isCenter: true, url: section.src ?? "" }) }}
          className={cx(style.thumbnail)}
        >
          {section.src && <ImageDelete section={section} srcKey={"thumbnail"} />}
          <button onClick={onClickThumbnailUpload} className={cx(style["drop-zone"])}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        <Textarea
          className={cx(style["title-input"])}
          inputType="title"
          isOptional={true}
          listIndex={0}
          style={{ color: textColor }}
          value={title.value}
        />
        <Textarea
          className={cx(style["description-input"])}
          inputType="description"
          isOptional={true}
          listIndex={1}
          style={{ color: textColor }}
          value={description.value}
        />
        <div className={cx(style["cta-wrapper"])}>
          <button style={{ backgroundColor: ctaStyle.backgroundColor }} className={cx(style.cta)}>
            <Input inputType="cta" listIndex={2} isOptional={false} style={{ color: ctaTextColor }} value={cta.value} />
          </button>
        </div>
      </div>
    </div>
  )
}
