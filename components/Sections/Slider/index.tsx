"use client"

import AddBtn from "@/components/AddBtn"
import DeleteBtn from "@/components/DeleteBtn"
import Input from "@/components/Input"
import { getImageUrl } from "@/config"
import { changeOpacity } from "@/config/colors"
import { useTranslation } from "@/i18n/client"
import { SectionType } from "@/types/Edit"
import { getAnimation } from "@/utils/getAnimation"
import cs from "classNames/bind"
import { memo, useMemo, useState } from "react"
import { FreeMode, Navigation, Thumbs } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import style from "./style.module.scss"
const cx = cs.bind(style)

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
    <Swiper spaceBetween={7} freeMode={true} slidesPerView={"auto"} modules={[FreeMode]} className={cx("slider")}>
      {section.list.map((v, i) => (
        <SwiperSlide className={cx("slide", section.design)} key={`card_${section.id}_${i}`}>
          <div
            style={{
              ...getAnimation({ type: section.style.animation, delay: i * 150 }),
              border: section.design !== "basic" ? `1px solid ${color}` : "none",
            }}
            className={cx("card", { cardStyle: section.design === "card" })}
          >
            {!isDisplayMode && <DeleteBtn srcKey="list" listIndex={i} />}
            <div className={cx("card-image")}>
              {/* <div style={{ background: getImageUrl({ isCenter: true, url: v.src }) }} className={cx("image")} /> */}
              <picture className={cx("image")}>
                <img src={v.src} alt="image" />
              </picture>
            </div>
            <div className={cx("content")}>
              <Input
                type="input"
                isOptional={true}
                className={cx(isDisplayMode ? style.title : "title-input")}
                listIndex={i}
                dataKey="title"
                inputType="title"
                displayMode={isDisplayMode && "h2"}
                value={v.data.title}
              />
              <Input
                type="textarea"
                className={cx(isDisplayMode ? style.description : "description-input")}
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
                  background: getImageUrl({ isCenter: true, url: v.src }),
                }}
                className={cx("photo")}
              >
                {!isDisplayMode && <DeleteBtn srcKey="list" listIndex={i} />}
              </div>
              <Input
                type="input"
                isOptional={true}
                dataKey={"title"}
                className={cx(isDisplayMode ? style.title : "title-input")}
                listIndex={i}
                displayMode={isDisplayMode && "h2"}
                inputType="title"
                value={v.data.title}
              />
              <Input
                type="textarea"
                listIndex={i}
                className={cx(isDisplayMode ? style.description : "description-input")}
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
        className={cx("thumb-list")}
      >
        {section.list.map((v, i) => (
          <SwiperSlide className={cx("thumb-list-slide")} key={`thumb_list_${i}`}>
            <div
              style={{
                background: getImageUrl({ isCenter: true, url: v.src }),
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

  const backgroundColor = useMemo(() => changeOpacity(section.style.color ?? "rgba(0,0,0,0)"), [section.style.color])
  return (
    <div className={cx("layout", { isDisplayMode: isDisplayMode })}>
      {section.list.length > 0 ? (
        <div style={{ background: section.style.backgroundColor }} className={cx("slider-layout")}>
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
          className={cx("noImage")}
        >
          <span>{t("noImage")}</span>
        </div>
      )}
      {!isDisplayMode && <AddBtn section={section} type="slider-image" />}
    </div>
  )
}
export default memo(Slider)
