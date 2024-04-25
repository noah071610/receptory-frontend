"use client"

import { SwiperNavigation } from "@/components/SwiperNavigation"
import { useTranslation } from "@/i18n/client"
import { useEditStore } from "@/store/edit"
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
  const { active, setActive, addSection, addList } = useEditStore()
  const modal = active.modal ?? active.sectionModal
  const onClickImage = (i: number) => {
    setSelectedImages((prev) => prev.filter((_, j) => i !== j))
  }

  const onClickUpload = async () => {
    // todo:
    setActive({ payload: null, key: "modal" })
    setActive({ payload: null, key: "sectionModal" })

    if (modal === "album" || modal === "slider") {
      if (active.modal) {
        addSection(modal)
      }

      await Promise.all(
        selectedImages.map(async ({ preview, ...file }, index) => {
          const formData = new FormData()
          formData.append("image", file)

          const img = new Image()

          img.addEventListener("load", () => {
            addList({
              type: active.modal as string,
              obj: { src: preview ?? "", width: img.naturalWidth, height: img.naturalHeight },
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
  }

  return (
    <div className={cx(style["overlay"])}>
      <div id="editor" style={getAnimation("fadeUp", 0, 600)} className={cx(style.modal)}>
        <Dropzone setSelectedImages={setSelectedImages} />
        {selectedImages.length > 0 && (
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
            <button onClick={onClickUpload} className={cx(style.upload)}>
              <span>{t("total {{number}} pic upload", { number: selectedImages.length })}</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
