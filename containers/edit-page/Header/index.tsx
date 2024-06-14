"use client"

import IconBtn from "@/components/IconBtn"
import { useEditorStore } from "@/store/editor"
import { EditStage } from "@/types/Edit"
import { faHome } from "@fortawesome/free-solid-svg-icons"
import cs from "classnames/bind"
import { useParams, useRouter } from "next/navigation"
import { memo } from "react"
import { useTranslation } from "react-i18next"
import { Swiper, SwiperSlide } from "swiper/react"
import HeaderLayout from "./HeaderLayout"
import RevertBtn from "./RevertBtn"
import SaveBtn from "./SaveBtn"
import style from "./style.module.scss"
const cx = cs.bind(style)

const headers = [
  {
    value: "home",
  },
  {
    value: "form",
  },
  {
    value: "confirm",
  },
  {
    value: "rending",
  },
]

function Header() {
  const { t } = useTranslation(["edit-page"])
  const { push } = useRouter()
  const { userId } = useParams()
  const { stage, setStage, setSelectedSection } = useEditorStore(["stage", "setStage", "setSelectedSection"])

  const onClickStage = (v: EditStage) => {
    setSelectedSection({ payload: null })
    setStage(v)
  }

  return (
    <>
      <HeaderLayout>
        <div className={cx("nav")}>
          <div></div>
          <div className={cx("inner")}>
            {headers.map((v) => (
              <div key={`header_${v.value}`} className={cx("list")}>
                <button
                  onClick={() => onClickStage(v.value as EditStage)}
                  className={cx({ active: v.value === stage })}
                >
                  <span>{t(v.value)}</span>
                </button>
              </div>
            ))}
          </div>
          <div className={cx("right")}>
            <IconBtn
              onclick={() => {
                push(`/user/${userId}`)
              }}
              size={30}
              iconClassName={style.rollback}
              icon={faHome}
            />
            <RevertBtn />
            <SaveBtn />
          </div>
          <div
            style={{ width: stage === "home" ? "25%" : stage === "form" ? "50%" : stage === "confirm" ? "75%" : "95%" }}
            className={cx("progress")}
          ></div>
        </div>
        <div className={cx("mobile-nav")}>
          <Swiper
            slidesPerView={3}
            spaceBetween={10}
            onClick={(swiper) => {
              swiper.slideTo(swiper.clickedIndex)
            }}
            onSlideChange={(swiper) => {
              const temp = headers[swiper.activeIndex]
              if (temp) {
                onClickStage(temp.value as EditStage)
              }
            }}
            centeredSlides={true}
            pagination={{
              clickable: true,
            }}
            className={cx("slider")}
          >
            {headers.map((v) => (
              <SwiperSlide className={cx("slide")} key={`mobile-header-${v.value}`}>
                <button
                  onClick={() => onClickStage(v.value as EditStage)}
                  className={cx({ active: v.value === stage })}
                >
                  <span>{t(v.value)}</span>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </HeaderLayout>
      <div className={cx("ghost")} />
    </>
  )
}

export default memo(Header)
