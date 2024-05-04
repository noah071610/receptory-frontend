"use client"

import AddBtn from "@/components/AddBtn"
import ImageDelete from "@/components/ImageDelete"
import Input from "@/components/Input"
import Textarea from "@/components/Textarea"
import { getImageUrl } from "@/config"
import { changeOpacity } from "@/config/colors"
import { useTranslation } from "@/i18n/client"
import { SectionType } from "@/types/Edit"
import { getAnimation } from "@/utils/getAnimation"
import classNames from "classNames"
import { memo, useMemo, useState } from "react"
import { FreeMode, Navigation, Thumbs } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const BasicSlider = ({
  section,
  isDisplayMode,
  color,
  backgroundColor,
}: {
  section: SectionType
  isDisplayMode?: boolean
  color?: string
  backgroundColor: string
}) => {
  return (
    <Swiper spaceBetween={7} freeMode={true} slidesPerView={"auto"} modules={[FreeMode]} className={cx(style.slider)}>
      {section.list.map((v, i) => (
        <SwiperSlide className={cx(style.slide, style[section.design])} key={`card_${section.id}_${i}`}>
          <div
            style={{
              ...getAnimation(section.style.animation, i * 150),
              border: section.design !== "basic" ? `1px solid ${color}` : "none",
            }}
            className={cx(style.card, { [style.cardStyle]: section.design === "card" })}
          >
            {!isDisplayMode && <ImageDelete section={section} srcKey="list" listIndex={i} />}
            <div className={cx(style["card-image"])}>
              {/* <div style={{ background: getImageUrl({ isCenter: true, url: v.src }) }} className={cx(style["image"])} /> */}
              <picture className={cx(style.image)}>
                <img src={v.src} alt="image" />
              </picture>
            </div>
            <div className={cx(style.content)}>
              <Input
                section={section}
                isOptional={true}
                className={cx(isDisplayMode ? style.title : style["title-input"])}
                listIndex={i}
                dataKey="title"
                inputType="title"
                displayMode={isDisplayMode && "h2"}
                value={v.data.title}
              />
              <Textarea
                section={section}
                className={cx(isDisplayMode ? style.description : style["description-input"])}
                listIndex={i}
                dataKey="description"
                inputType="description"
                displayMode={isDisplayMode && "p"}
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
const ThumbnailSlider = ({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  return (
    <>
      <Swiper
        className={cx(style["thumb-slider"])}
        spaceBetween={10}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
      >
        {section.list.map((v, i) => (
          <SwiperSlide className={cx(style["thumb-slide"])} key={`thumb_main_${i}`}>
            <div className={cx(style.thumb)}>
              <div
                style={{
                  background: getImageUrl({ isCenter: true, url: v.src }),
                }}
                className={cx(style.photo)}
              >
                {!isDisplayMode && <ImageDelete section={section} srcKey="list" listIndex={i} />}
              </div>
              <Input
                section={section}
                isOptional={true}
                dataKey={"title"}
                className={cx(isDisplayMode ? style.title : style["title-input"])}
                listIndex={i}
                displayMode={isDisplayMode && "h2"}
                inputType="title"
                value={v.data.title}
              />
              <Textarea
                section={section}
                listIndex={i}
                className={cx(isDisplayMode ? style.description : style["description-input"])}
                dataKey={"description"}
                displayMode={isDisplayMode && "p"}
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

function Slider({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { t } = useTranslation()

  const backgroundColor = useMemo(() => changeOpacity(section.style.color ?? "rgba(0,0,0,0)"), [section.style.color])
  return (
    <div className={cx(style["layout"], { [style.isDisplayMode]: isDisplayMode })}>
      {section.list.length > 0 ? (
        <div style={{ background: section.style.backgroundColor }} className={cx(style["slider-layout"])}>
          {section.design !== "thumbnail" ? (
            <BasicSlider
              backgroundColor={backgroundColor}
              color={section.style.color}
              section={section}
              isDisplayMode={isDisplayMode}
            />
          ) : (
            <ThumbnailSlider section={section} isDisplayMode={isDisplayMode} />
          )}
        </div>
      ) : isDisplayMode ? (
        <></>
      ) : (
        <div
          style={{ background: getImageUrl({ isCenter: true, url: "/images/noImage.png" }) }}
          className={cx(style.noImage)}
        >
          <span>{t("noImage")}</span>
        </div>
      )}
      {!isDisplayMode && <AddBtn section={section} type="slider-image" />}
    </div>
  )
}
export default memo(Slider)
