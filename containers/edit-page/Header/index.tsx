"use client"

import IconBtn from "@/components/IconBtn"
import { queryKey } from "@/config"
import { useEditorStore } from "@/store/editor"
import { EditStage } from "@/types/Edit"
import { Langs } from "@/types/Main"
import { saveContentFromEditor } from "@/utils/editor/saveContentFromEditor"
import { faCheck, faHome, faRotateLeft, faRotateRight, faSave } from "@fortawesome/free-solid-svg-icons"
import { useQueryClient } from "@tanstack/react-query"
import cs from "classNames/bind"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
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

export default function Header() {
  const queryClient = useQueryClient()
  const { push } = useRouter()
  const { lang, pageId, userId } = useParams()
  const {
    stage,
    setStage,
    setSelectedSection,
    homeSections,
    formSections,
    currentUsedImages,
    currentUsedColors,
    setRevert,
    revert,
    revertIndex,
    confirmSections,
    pageOptions,
  } = useEditorStore()
  const [isSaving, setIsSaving] = useState(false)

  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 100)
      setPrevScrollPos(currentScrollPos)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [prevScrollPos, visible])

  const onClickStage = (v: EditStage) => {
    setSelectedSection({ payload: null })
    setStage(v)
  }

  const onClickSave = async () => {
    if (!isSaving) {
      const isOk = await saveContentFromEditor({
        content: {
          stage,
          homeSections,
          formSections,
          confirmSections,
          currentUsedImages,
          currentUsedColors,
          pageOptions,
        },
        pageId,
        lang: lang as Langs,
      })

      if (isOk) {
        await queryClient.invalidateQueries({ queryKey: queryKey.save.list })
        setRevert("clear")
      }

      setIsSaving(true)
      setTimeout(() => {
        setIsSaving(false)
      }, 3000)
    }
  }

  const onClickRevert = (type: "do" | "undo") => {
    setRevert(type)
  }

  return (
    <>
      <header className={cx("header", { visible: visible })}>
        <div className={cx("nav")}>
          <div></div>
          <div className={cx("inner")}>
            {headers.map((v) => (
              <div key={`header_${v.value}`} className={cx("list")}>
                <button
                  onClick={() => onClickStage(v.value as EditStage)}
                  className={cx({ active: v.value === stage })}
                >
                  <span>{v.value}</span>
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
            <IconBtn
              disabled={revert.length <= 1 || revertIndex <= 0}
              onclick={() => onClickRevert("undo")}
              size={30}
              iconClassName={style.rollback}
              icon={faRotateLeft}
            />
            <IconBtn
              disabled={revert.length - 1 === revertIndex}
              onclick={() => onClickRevert("do")}
              size={30}
              iconClassName={style.rollback}
              icon={faRotateRight}
            />
            {isSaving ? (
              <IconBtn iconClassName={style.saving} size={30} icon={faCheck} />
            ) : (
              <IconBtn onclick={onClickSave} size={30} icon={faSave} />
            )}
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
                  <span>{v.value}</span>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </header>
      <div className={cx("ghost")} />
    </>
  )
}
