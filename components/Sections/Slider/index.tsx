"use client"

import AddBtn from "@/components/AddBtn"
import ImageDelete from "@/components/ImageDelete"
import Input from "@/components/Input"
import Textarea from "@/components/Textarea"
import { getImageUrl } from "@/config"
import { useTranslation } from "@/i18n/client"
import { SectionType } from "@/types/Edit"
import { getAnimation } from "@/utils/getAnimation"
import classNames from "classNames"
import { memo, useState } from "react"
import { FreeMode, Navigation, Thumbs } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const BasicSlider = ({ section }: { section: SectionType }) => {
  return (
    <Swiper spaceBetween={10} freeMode={true} slidesPerView={"auto"} modules={[FreeMode]} className={cx(style.slider)}>
      {section.list.map((v, i) => (
        <SwiperSlide className={cx(style.slide, style[section.design])} key={`card_${section.id}_${i}`}>
          <div style={{ ...getAnimation(section.style.animation, i * 150) }} className={cx(style.card)}>
            <ImageDelete section={section} srcKey="list" listIndex={i} />
            <div className={cx(style["card-image"])}>
              <div style={{ background: getImageUrl({ isCenter: true, url: v.src }) }} className={cx(style["image"])} />
            </div>
            <div className={cx(style.content)}>
              <Input
                isOptional={true}
                className={cx(style["title-input"])}
                listIndex={i}
                dataKey="title"
                inputType="title"
                value={v.data.title}
              />
              <Textarea
                className={cx(style["description-input"])}
                listIndex={i}
                dataKey="description"
                inputType="description"
                isOptional={true}
                value={v.data.description}
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
const ThumbnailSlider = ({ section }: { section: SectionType }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  return (
    <>
      <Swiper spaceBetween={10} thumbs={{ swiper: thumbsSwiper }} modules={[FreeMode, Navigation, Thumbs]}>
        {section.list.map((v, i) => (
          <SwiperSlide className={cx(style["thumb-slide"])} key={`thumb_main_${i}`}>
            <div className={cx(style.thumb)}>
              <div
                style={{
                  background: getImageUrl({ isCenter: true, url: v.src }),
                }}
                className={cx(style.photo)}
              >
                <ImageDelete section={section} srcKey="list" listIndex={i} />
              </div>
              <Input
                isOptional={true}
                dataKey={"title"}
                className={cx(style["title-input"])}
                listIndex={i}
                inputType="title"
                value={v.data.title}
              />
              <Textarea
                className={cx(style["description-input"])}
                listIndex={i}
                dataKey={"description"}
                inputType="description"
                isOptional={true}
                value={v.data.description}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper as any}
        spaceBetween={5}
        slidesPerView={section.list.length >= 4 ? 4 : section.list.length}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className={cx(style["thumb-list"])}
      >
        {section.list.map((v, i) => (
          <SwiperSlide className={cx(style["thumb-list-slide"])} key={`thumb_list_${i}`}>
            <div
              style={{
                background: getImageUrl({ isCenter: true, url: v.src }),
                ...getAnimation(section.style.animation, i * 150),
              }}
              className={cx(style["photo"])}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}

function Slider({ section }: { section: SectionType }) {
  const { t } = useTranslation()
  return (
    <div className={cx(style["layout"])}>
      {section.list.length > 0 ? (
        <div className={cx(style["slider-layout"])}>
          {section.design !== "thumbnail" ? <BasicSlider section={section} /> : <ThumbnailSlider section={section} />}
        </div>
      ) : (
        <div
          style={{ background: getImageUrl({ isCenter: true, url: "/images/noImage.png" }) }}
          className={cx(style.noImage)}
        >
          <span>{t("noImage")}</span>
        </div>
      )}
      <AddBtn section={section} type="slider-image" />
    </div>
  )
}
export default memo(Slider)
