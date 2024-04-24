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
  const { currentTooltip, setCurrentTooltip, setList, addSection, addList, addImages } = useEditStore()
  const onClickImage = (i: number) => {
    setSelectedImages((prev) => prev.filter((_, j) => i !== j))
  }
  const onClickUpload = async () => {
    // todo:
    setCurrentTooltip({ type: null })
    if (currentTooltip === "slider") {
      addSection(currentTooltip)
      addList({ totalNum: selectedImages.length })
      await Promise.all(
        selectedImages.map(async ({ preview, ...file }, index) => {
          const formData = new FormData()
          formData.append("image", file)
          // const { msg, data: imageSrc } = await uploadImage(formData)
          // if (msg === "ok") {
          // }
          // todo: 프레뷰도 수정해줘야함. 이건 예시임
          setList({ index, key: "src", payload: preview ?? "" })
        })
      )
    }
    if (currentTooltip === "album") {
      addSection(currentTooltip)
      await Promise.all(
        selectedImages.map(async ({ preview, ...file }, index) => {
          const formData = new FormData()
          formData.append("image", file)
          // const { msg, data: imageSrc } = await uploadImage(formData)
          // if (msg === "ok") {
          // }
          // todo: 이건 왜이러지? 일단 보류
          addImages({ src: preview ?? "", width: 400, height: 500 })
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
