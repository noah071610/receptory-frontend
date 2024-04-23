"use client"

import ImageDelete from "@/components/ImageDelete"
import Input from "@/components/Input"
import Textarea from "@/components/Textarea"
import { getImageUrl } from "@/config"
import { useTranslation } from "@/i18n/client"
import { useEditStore } from "@/store/edit"
import { SectionType } from "@/types/Edit"
import getContrastTextColor from "@/utils/getContrastTextColor"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { useParams } from "next/navigation"
import { useCallback, useMemo } from "react"
import { useDropzone } from "react-dropzone"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function Thumbnail({ section }: { section: SectionType }) {
  const { lang } = useParams()

  const { setSrc } = useEditStore()
  const { t } = useTranslation(lang, ["new-post-page"])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(async (file: any) => {
      const formData = new FormData()
      formData.append("image", file)

      // const { msg, data: imageSrc } = await uploadImage(formData)
      // if (msg === "ok") {
      // }
      if (process.env.NODE_ENV === "development") {
        setSrc({
          key: "thumbnail",
          payload:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxMX47KdHnDG65nL8gniQhv5v37xWUjWlMJWZa24-syw&s",
        })
      }
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/*": [],
    },
    maxSize: 8000000,
  })

  const customColors = useMemo(() => section.colors, [section.colors])
  const ctaTextColor = useMemo(() => getContrastTextColor(section.colors.ctaColor), [section.colors.ctaColor])

  return (
    <div
      style={{
        background: section.src["bgImage"]
          ? getImageUrl({ isCenter: true, url: section.src["bgImage"] ?? "" })
          : `linear-gradient(180deg, ${customColors.bgColor} 87%, rgba(0,0,0,0) 100%)`,
      }}
      className={cx(style.wrapper)}
    >
      {section.src["bgImage"] && <ImageDelete section={section} srcKey={"bgImage"} />}
      <div className={cx(style.main)}>
        <div
          style={{ background: getImageUrl({ isCenter: true, url: section.src["thumbnail"] ?? "" }) }}
          className={cx(style.thumbnail)}
        >
          {section.src["thumbnail"] && <ImageDelete section={section} srcKey={"thumbnail"} />}
          <div className={cx(style["drop-zone"], { [style.active]: isDragActive })} {...getRootProps()}>
            <input {...getInputProps()} />
            <FontAwesomeIcon icon={faPlus} />
          </div>
        </div>
        <Textarea
          className={cx(style["title-input"])}
          inputType="title"
          isOptional={true}
          color={customColors.textColor}
          value={section.title}
        />
        <Textarea
          className={cx(style["description-input"])}
          inputType="description"
          isOptional={true}
          color={customColors.textColor}
          value={section.description}
        />
        <div className={cx(style["cta-wrapper"])}>
          <button style={{ backgroundColor: customColors.ctaColor }} className={cx(style.cta)}>
            <Input inputType="cta" isOptional={false} color={ctaTextColor} value={section.values["ctaText"] ?? ""} />
          </button>
        </div>
      </div>
    </div>
  )
}
