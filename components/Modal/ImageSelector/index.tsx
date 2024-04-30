"use client"

import { SwiperNavigation } from "@/components/SwiperNavigation"
import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { ImageUpload } from "@/types/Edit"
import { getAnimation } from "@/utils/getAnimation"
import { faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { useState } from "react"
import { FreeMode } from "swiper/modules"
import { SwiperSlide } from "swiper/react"
import Dropzone from "./Dropzone"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function ImageSelector() {
  const [selectedImages, setSelectedImages] = useState<ImageUpload[]>([])

  const { t } = useTranslation()
  const { active, setActive, addSection, addList, setSrc, setList, stage } = useEditorStore()

  const onClickImage = (i: number) => {
    setSelectedImages((prev) => prev.filter((_, j) => i !== j))
  }

  const onClickUpload = async () => {
    const targetType = active.modal.type
    if (targetType === "thumbnail" || targetType === "callout" || targetType === "select") {
      const formData = new FormData()
      const { preview, ...file } = selectedImages[0]
      formData.append("image", file)

      const img = new Image()

      img.addEventListener("load", () => {
        if (targetType === "thumbnail" || targetType === "callout") {
          setSrc({
            payload: preview ?? "",
          })
        }

        if (targetType === "select") {
          setList({
            index: active.modal.payload,
            key: "src",
            payload: preview ?? "",
          })
        }
        // if (targetType === "background") {
        //   setStyle({
        //     key: "background",
        //     payload: preview ?? "",
        //   })
        // }
        // if (active.modal === "listBackground") {
        //   setStyle({
        //     key: "background",
        //     payload: preview ?? "",
        //   })
        // }
      })

      img.src = preview ?? ""
    }

    if (targetType === "album" || targetType === "slider") {
      addSection({ payload: targetType, stage })

      await Promise.all(
        selectedImages.map(async ({ preview, ...file }, index) => {
          const formData = new FormData()
          formData.append("image", file)

          const img = new Image()

          img.addEventListener("load", () => {
            addList({
              type: targetType,
              obj: { src: preview ?? "", style: { width: img.naturalWidth ?? 0, height: img.naturalHeight ?? 0 } },
            })
          })

          img.src = preview ?? ""

          // const { msg, data: imageSrc } = await uploadImage(formData)
          // if (msg === "ok") {
          // }
          // todo:  일단 보류
        })
      )
    }

    setActive({ payload: { type: null, payload: null }, key: "modal" })
  }

  return (
    <div className={cx(style["overlay"])}>
      <div id="editor" style={getAnimation("fadeUp", 0, 600)} className={cx(style.modal)}>
        <Dropzone selectedImages={selectedImages} setSelectedImages={setSelectedImages} />
        {selectedImages.length > 1 && (
          <>
            <h2>{t("imagePreview")}</h2>
            <SwiperNavigation
              perSlideView={4}
              className={cx(style.slider)}
              spaceBetween={5}
              slidesPerView={"auto"}
              modules={[FreeMode]}
              prevArrowClassName={style.prev}
              nextArrowClassName={style.next}
            >
              {selectedImages.map(({ preview }, i) => {
                return (
                  <SwiperSlide className={cx(style["slide"])} key={`thumb_main_${i}`}>
                    <div className={cx(style.photo)}>
                      <FontAwesomeIcon onClick={() => onClickImage(i)} icon={faClose} />
                      <img src={preview ?? ""} alt={`preview_${i}`} />
                    </div>
                  </SwiperSlide>
                )
              })}
            </SwiperNavigation>
          </>
        )}
        {selectedImages.length > 0 && (
          <button onClick={onClickUpload} className={cx(style.upload)}>
            <span>{t("total {{number}} pic upload", { number: selectedImages.length })}</span>
          </button>
        )}
      </div>
    </div>
  )
}
