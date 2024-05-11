"use client"

import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { ImageUpload } from "@/types/Edit"
import { faImages } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Dispatch, SetStateAction, memo, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import style from "./style.module.scss"

import cs from "classNames/bind"
const cx = cs.bind(style)

function Dropzone({
  className,
  setSelectedImages,
  isMultiple,
}: {
  className?: string
  setSelectedImages: Dispatch<SetStateAction<ImageUpload[]>>
  isMultiple: boolean
}) {
  const { t } = useTranslation()
  const { selectedSection } = useEditorStore()

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
            const target: ImageUpload = { file, payload: reader.result as string, uploadType: "file" }
            setSelectedImages((prev) => (isMultiple ? [...prev, target] : [target]))
          }
        }
      })
    },
    [selectedSection, isMultiple]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDropRejected: (files) => {
      if (files.length > 10) {
        return alert("10개 이하의 이미지를 업로드 해주세요")
      }
      for (let i = 0; i < files.length; i++) {
        return alert(files[i].errors[0].code)
      }
    },
    multiple: isMultiple,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg"],
    },
    maxFiles: 10,
    maxSize: 8000000, // 8mb
  })

  return (
    <div className={cx("thumbnail")}>
      <div className={cx(className ?? "drop-zone")} {...getRootProps()}>
        <input {...getInputProps()} />
        <div className={cx("icon")}>
          <FontAwesomeIcon icon={faImages} />
          <label>{t("imageDragAndDrop")}</label>
        </div>
      </div>
    </div>
  )
}

export default memo(Dropzone)
