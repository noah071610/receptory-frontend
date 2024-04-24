"use client"

import { useTranslation } from "@/i18n/client"
import { useEditStore } from "@/store/edit"
import { SectionType } from "@/types/Edit"
import { faImages } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { memo, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import style from "./style.module.scss"
const cx = classNames.bind(style)

function Dropzone({
  className,
  section,
  height,
  listIndex,
  multiple,
  srcKey,
}: {
  className?: string
  height?: number
  listIndex?: number
  multiple?: boolean
  srcKey: string
  section: SectionType
}) {
  const { t } = useTranslation()
  const { setSrc, setList, addImages, addList, selectedSection, setSelectedSection } = useEditStore()
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!selectedSection) setSelectedSection({ payload: section })
      if (multiple) {
        addList({ totalNum: acceptedFiles.length })
      }
      acceptedFiles.forEach(async (file: any, i: number) => {
        const formData = new FormData()
        formData.append("image", file)

        // const { msg, data: imageSrc } = await uploadImage(formData)
        // if (msg === "ok") {
        // }

        if (process.env.NODE_ENV === "development") {
          if (multiple) {
            if (srcKey === "images") {
              addImages({
                width: 400,
                height: 500,
                src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWP8lkgZY6Lgl__qaEOJpSkwvBlxpl7hx2oT0KNtEOHw&s",
              })
            } else {
              setList({
                key: "src",
                index: i,
                payload:
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/800px-A_small_cup_of_coffee.JPG",
              })
            }
          } else {
            if (typeof listIndex === "number") {
              setList({
                key: "src",
                index: listIndex,
                payload:
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/800px-A_small_cup_of_coffee.JPG",
              })
            } else {
              setSrc({
                key: srcKey,
                payload:
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/800px-A_small_cup_of_coffee.JPG",
              })
            }
          }
        }
      })
    },
    [srcKey, listIndex, multiple, selectedSection]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: !!multiple,
    accept: {
      "image/*": [],
    },
    maxSize: 8000000,
  })

  return (
    <div
      style={{ height: height ? `${height}px` : "250px" }}
      className={cx(className ?? style["drop-zone"])}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <div className={cx(style.icon)}>
        <FontAwesomeIcon icon={faImages} />
        <label>{t("imageDragAndDrop")}</label>
      </div>
    </div>
  )
}

export default memo(Dropzone)
