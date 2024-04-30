"use client"

import { getImageUrl } from "@/config"
import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
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
  selectedImages,
  setSelectedImages,
}: {
  className?: string
  selectedImages: ImageUpload[]
  setSelectedImages: Dispatch<SetStateAction<ImageUpload[]>>
}) {
  const { t } = useTranslation()
  const { selectedSection, active } = useEditorStore()
  const isMultiple =
    active.modal.type !== "thumbnail" &&
    active.modal.type !== "background" &&
    active.modal.type !== "callout" &&
    active.modal.type !== "select"

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
            const target = { ...file, preview: reader.result }
            setSelectedImages((prev) => (isMultiple ? [...prev, target] : [target]))
          }
        }
      })
    },
    [selectedSection, isMultiple]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: isMultiple,
    accept: {
      "image/*": [],
    },
    maxSize: 8000000,
  })

  return (
    <div
      style={{
        background:
          selectedImages.length === 1 ? getImageUrl({ url: selectedImages[0].preview ?? "", isCenter: true }) : "none",
      }}
      className={cx(style.thumbnail)}
    >
      <div className={cx(className ?? style["drop-zone"])} {...getRootProps()}>
        <input {...getInputProps()} />
        <div
          className={cx(style.icon, {
            [style.selectedOne]: selectedImages.length === 1,
          })}
        >
          <FontAwesomeIcon icon={faImages} />
          <label>{t("imageDragAndDrop")}</label>
        </div>
      </div>
    </div>
  )
}

export default memo(Dropzone)
