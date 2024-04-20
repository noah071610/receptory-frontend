"use client"

import { getImageUrl } from "@/_data"
import { useTranslation } from "@/i18n/client"
import { faImage, faPalette, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { useParams } from "next/navigation"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function Thumbnail() {
  const { lang } = useParams()
  const { t } = useTranslation(lang, ["new-post-page"])

  const onChangeInput = (e: any, type: "title" | "description") => {
    if (type === "title" && e.target.value.length >= 60) return
    if (type === "description" && e.target.value.length >= 80) return

    // setNewPost({ type, payload: e.target.value })
  }
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(async (file: any) => {
      const formData = new FormData()
      formData.append("image", file)

      // const { msg, data: imageSrc } = await uploadImage(formData)
      // if (msg === "ok") {
      // }
    })
  }, [])

  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0])
  }

  const handleUpload = () => {
    if (selectedFile) {
      // Here you can perform file upload logic
      console.log("Uploading file:", selectedFile)
    } else {
      alert("Please select a file to upload.")
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/*": [],
    },
    maxSize: 8000000,
  })
  return (
    <section className={cx(style.section)}>
      <div className={cx(style.main)}>
        <div className={cx(style.thumbnail)}>
          {/* <button onClick={onClickDeleteImage} className={cx(style.close)}>
          <FontAwesomeIcon icon={faClose} />
        </button> */}
          <div
            style={{
              background: getImageUrl({ url: "/images/post/no-image.png", isCenter: true }),
            }}
            className={cx(style["drop-zone"])}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <FontAwesomeIcon icon={faPlus} />
          </div>
          {/* <div
          style={{
            backgroundImage: getImageUrl({ url: "" }),
          }}
          className={cx("thumbnail")}
        ></div> */}
        </div>
        <input
          className={"description-input"}
          placeholder={t("enterDesc") + " " + t("optional")}
          // value={description ?? ""}
          value={""}
          onChange={(e) => onChangeInput(e, "description")}
        />
      </div>

      <div className={cx(style["add-bg-btn"])}>
        <button>
          <FontAwesomeIcon icon={faPalette} />
        </button>
        <button>
          <input {...getInputProps()} />
          <FontAwesomeIcon icon={faImage} />
        </button>
      </div>
    </section>
  )
}
