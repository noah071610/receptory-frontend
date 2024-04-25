"use client"

import { useTranslation } from "@/i18n/client"
import { useEditStore } from "@/store/edit"
import { ImageUpload } from "@/types/Edit"
import { faImages } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { Dispatch, SetStateAction, memo, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import style from "./style.module.scss"
const cx = classNames.bind(style)

function Dropzone({
  className,
  setSelectedImages,
}: {
  className?: string
  setSelectedImages: Dispatch<SetStateAction<ImageUpload[]>>
}) {
  const { t } = useTranslation()
  const { selectedSection } = useEditStore()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach(async (file: any, i: number) => {
        const formData = new FormData()
        formData.append("image", file)
        // const { msg, data: imageSrc } = await uploadImage(formData)
        // if (msg === "ok") {
        // }

        if (process.env.NODE_ENV === "development") {
          const reader = new FileReader()
          reader.readAsDataURL(file)

          reader.onloadend = async () => {
            setSelectedImages((prev) => [...prev, { ...file, preview: reader.result }])
          }
        }
      })
    },
    [selectedSection]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/*": [],
    },
    maxSize: 8000000,
  })

  return (
    <div className={cx(className ?? style["drop-zone"])} {...getRootProps()}>
      <input {...getInputProps()} />
      <div className={cx(style.icon)}>
        <FontAwesomeIcon icon={faImages} />
        <label>{t("imageDragAndDrop")}</label>
      </div>
    </div>
  )
}

export default memo(Dropzone)
