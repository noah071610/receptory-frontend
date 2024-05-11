"use client"

import AddBtn from "@/components/AddBtn"
import DeleteBtn from "@/components/DeleteBtn"
import Input from "@/components/Input"
import { getImageUrl } from "@/utils/helpers/getImageUrl"

import { useTranslation } from "@/i18n/client"
import { SectionType } from "@/types/Edit"
import hasString from "@/utils/helpers/hasString"
import { getAnimation } from "@/utils/styles/getAnimation"
import getContrastTextColor from "@/utils/styles/getContrastTextColor"
import cs from "classNames/bind"
import { memo, useMemo, useState } from "react"
import { FreeMode, Navigation, Thumbs } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import style from "./style.module.scss"
const cx = cs.bind(style)

const BasicSlider = ({
  section,
  isDisplayMode,
  textColor,
}: {
  section: SectionType
  isDisplayMode?: boolean
  textColor?: string
}) => {
  return (
    <Swiper spaceBetween={7} freeMode={true} slidesPerView={"auto"} modules={[FreeMode]} className={cx("slider")}>
      {section.list.map((v, i) => (
        <SwiperSlide className={cx("slide", section.design)} key={`card_${section.id}_${i}`}>
          <div
            style={{
              ...getAnimation({ type: section.style.animation, delay: i * 150 }),
            }}
            className={cx("slide-inner")}
          >
            {!isDisplayMode && <DeleteBtn srcKey="list" listIndex={i} />}
            <div className={cx("card-image")}>
              {/* <div style={{ background: getImageUrl({  url: v.src }) }} className={cx("image")} /> */}
              <picture className={cx("image")}>
                <img src={v.src} alt="image" />
              </picture>
            </div>
            <div className={cx("content")}>
              {isDisplayMode ? (
                <>
                  {hasString(v.data.title) && (
                    <h2 style={{ color: textColor }} className={cx("title")}>
                      {v.data.title}
                    </h2>
                  )}
                  {hasString(v.data.description) && (
                    <p style={{ color: textColor }} className={cx("description")}>
                      {v.data.description}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <Input
                    style={{ color: textColor }}
                    type="input"
                    isOptional={true}
                    dataKey={"title"}
                    className={cx("title-input")}
                    listIndex={i}
                    inputType="title"
                    value={v.data.title}
                    section={section}
                  />
                  <Input
                    style={{ color: textColor }}
                    type="textarea"
                    listIndex={i}
                    className={cx("description-input")}
                    dataKey={"description"}
                    inputType="description"
                    isOptional={true}
                    value={v.data.description}
                    section={section}
                  />
                </>
              )}
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
const ThumbnailSlider = ({
  section,
  isDisplayMode,
  textColor,
}: {
  section: SectionType
  isDisplayMode?: boolean
  textColor?: string
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  return (
    <>
      <Swiper
        className={cx("thumb-slider")}
        spaceBetween={10}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
      >
        {section.list.map((v, i) => (
          <SwiperSlide className={cx("thumb-slide")} key={`thumb_main_${i}`}>
            <div className={cx("thumb")}>
              <div
                style={{
                  background: getImageUrl({ url: v.src }),
                }}
                className={cx("photo")}
              >
                {!isDisplayMode && <DeleteBtn srcKey="list" listIndex={i} />}
              </div>
              <div>
                {isDisplayMode ? (
                  <>
                    {hasString(v.data.title) && (
                      <h2 style={{ color: textColor }} className={cx("title")}>
                        {v.data.title}
                      </h2>
                    )}
                    {hasString(v.data.description) && (
                      <p style={{ color: textColor }} className={cx("description")}>
                        {v.data.description}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <Input
                      type="input"
                      isOptional={true}
                      dataKey={"title"}
                      className={cx("title-input")}
                      listIndex={i}
                      inputType="title"
                      value={v.data.title}
                      style={{ color: textColor }}
                      section={section}
                    />
                    <Input
                      type="textarea"
                      listIndex={i}
                      className={cx("description-input")}
                      dataKey={"description"}
                      inputType="description"
                      isOptional={true}
                      value={v.data.description}
                      style={{ color: textColor }}
                      section={section}
                    />
                  </>
                )}
              </div>
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
        className={cx("thumb-list")}
      >
        {section.list.map((v, i) => (
          <SwiperSlide className={cx("thumb-list-slide")} key={`thumb_list_${i}`}>
            <div
              style={{
                background: getImageUrl({ url: v.src }),
                ...getAnimation({ type: section.style.animation, delay: i * 150 }),
              }}
              className={cx("photo")}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}

function Slider({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { t } = useTranslation()

  const textColor = useMemo(
    () =>
      section.design === "card" || section.design === "circle"
        ? undefined
        : getContrastTextColor(section.style.backgroundColor ?? "rgba(0,0,0,0)"),
    [section.style.backgroundColor, section.design]
  )
  return (
    <div className={cx("layout", { isDisplayMode: isDisplayMode })}>
      {section.list.length > 0 ? (
        <div style={{ background: section.style.backgroundColor }} className={cx("slider-layout")}>
          {section.design !== "thumbnail" ? (
            <BasicSlider textColor={textColor} section={section} isDisplayMode={isDisplayMode} />
          ) : (
            <ThumbnailSlider textColor={textColor} section={section} isDisplayMode={isDisplayMode} />
          )}
        </div>
      ) : isDisplayMode ? (
        <></>
      ) : (
        <div style={{ background: getImageUrl({ url: "/images/noImage.png" }) }} className={cx("noImage")}>
          <span>{t("noImage")}</span>
        </div>
      )}
      {!isDisplayMode && <AddBtn section={section} type="slider-image" />}
    </div>
  )
}
export default memo(Slider)
