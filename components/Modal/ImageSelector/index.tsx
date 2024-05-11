"use client"

import DeleteBtn from "@/components/DeleteBtn"
import { SwiperNavigation } from "@/components/SwiperNavigation"
import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { ImageUpload, SectionListType, SectionListTypes } from "@/types/Edit"
import { createNewSection, createNewSectionList } from "@/utils/createNewSection"
import cs from "classNames/bind"
import { useEffect, useState } from "react"
import { FreeMode } from "swiper/modules"
import { SwiperSlide } from "swiper/react"
import ModalLayout from ".."
import Dropzone from "./Dropzone"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function ImageSelector() {
  const [selectedImages, setSelectedImages] = useState<Array<ImageUpload>>([])
  const [listForRending, setListForRending] = useState<SectionListType[]>([])

  const { t } = useTranslation()
  const {
    active,
    setActive,
    addSection,
    setStyle,
    initSections,
    setSrc,
    setList,
    addList,
    addUsed,
    currentUsedImages,
  } = useEditorStore()
  const [currentUsedImagesArr, setCurrentUsedImagesArr] = useState(
    currentUsedImages?.map((v) => ({ src: v, isAdd: false })) ?? []
  )

  const type = active.modal.type?.replace("-image", "")

  const isMultiple = type === "album" || type === "slider"

  const onClickUpload = async () => {
    if (!type) return

    await Promise.allSettled(
      selectedImages.map(async (imageUpload, index) => {
        const { payload, uploadType, file } = imageUpload
        if (!payload) return

        const formData = new FormData()
        const urlArr = []

        if (uploadType === "file") {
          if (file) formData.append("image", file)
        } else {
          urlArr.push(payload)
        }

        const img = new Image()

        img.addEventListener("load", () => {
          addUsed({ type: "currentUsedImages", payload })
          if (type === "thumbnail" || type === "callout") {
            return setSrc({
              payload,
            })
          }

          if (type === "select") {
            // 스토어에서 히스토리 저장
            return setList({
              index: active.modal.payload,
              key: "src",
              payload,
            })
          }
          if (type === "background") {
            return setStyle({
              key: "background",
              payload,
            })
          }

          setListForRending((arr) => [
            ...arr,
            createNewSectionList(type, index, {
              src: payload,
              style: { width: img.naturalWidth ?? 0, height: img.naturalHeight ?? 0 },
            }),
          ])
        })

        img.addEventListener("error", () => {
          if (isMultiple) {
            setListForRending((arr) => [
              ...arr,
              createNewSectionList(type, index, {
                src: "",
                style: { width: 0, height: 0 },
              }),
            ])
          }
        })

        img.src = payload

        // const { msg, data: imageSrc } = await uploadImage(formData)
        // if (msg === "ok") {
        // }
        // todo:  일단 보류
      })
    )
    if (!isMultiple) setActive({ payload: { type: null, payload: null }, key: "modal" })
  }

  const onClickCurImage = (src: string, i: number, isAdd: boolean) => {
    if (isAdd) {
      // 셀렉 이미지를 지운다. 멀티플이든 동일
      setSelectedImages((prev) => prev.filter(({ payload }) => payload !== src))
    } else {
      if (isMultiple) {
        // 멀티플이면 추가
        setSelectedImages((prev) => [{ payload: src, uploadType: "url" }, ...prev])
      } else {
        // 단수 선택이면? 그냥 대체
        setSelectedImages([{ payload: src, uploadType: "url" }])
      }
    }

    if (isMultiple) {
      // 멀티플이면 토글형식으로 타겟 isAdd 만 바꿔주자
      setCurrentUsedImagesArr((prev) => {
        return prev.map((v, j) => (i === j ? { ...v, isAdd: !v.isAdd } : v))
      })
    } else {
      // 단수 선택이면 한녀석만 토글하고 나머지는 다 false로 해주자
      setCurrentUsedImagesArr((prev) => {
        return prev.map((v, j) => ({ ...v, isAdd: i === j ? !v.isAdd : false }))
      })
    }
  }

  const deleteSelectedImage = (i: number) => {
    setSelectedImages((prev) => prev.filter((_, j) => j !== i))
  }

  useEffect(() => {
    if (!listForRending.length || !selectedImages.length) return

    if (type && listForRending.length >= selectedImages.length) {
      const filteredImageList = listForRending.filter((v) => !!v.src)
      if (active.modal.payload === "add") {
        addList({ type: type as SectionListTypes, valueArrForNewList: filteredImageList })
      } else {
        const newSection = createNewSection({ type: type as SectionListTypes, index: initSections.length })
        newSection.list = [...filteredImageList]
        addSection({
          type: type as SectionListTypes,
          payload: newSection,
        })
      }
      setListForRending([])
      setActive({ payload: { type: null, payload: null }, key: "modal" })
    }
  }, [listForRending.length, selectedImages.length, type, initSections.length])

  return (
    <ModalLayout modalStyle={style.content}>
      {selectedImages.length > 0 ? (
        <SwiperNavigation
          perSlideView={1}
          isSingle={selectedImages.length <= 1}
          className={cx("preview-slider")}
          slidesPerView={1}
          prevArrowClassName={style.prev}
          nextArrowClassName={style.next}
        >
          {selectedImages.map(({ payload }, i) => {
            return (
              <SwiperSlide className={cx("slide")} key={`thumb_main_${i}`}>
                <div className={cx("preview-image")}>
                  <DeleteBtn deleteEvent={deleteSelectedImage} srcKey="imageModal" listIndex={i} />
                  <img src={payload ?? ""} alt={`preview_${i}`} />
                </div>
              </SwiperSlide>
            )
          })}
        </SwiperNavigation>
      ) : (
        <Dropzone isMultiple={isMultiple} setSelectedImages={setSelectedImages} />
      )}
      {currentUsedImagesArr.length > 0 && (
        <>
          <h2>{t("currentUsedImages")}</h2>
          <SwiperNavigation
            perSlideView={4}
            className={cx("slider")}
            spaceBetween={5}
            slidesPerView={"auto"}
            modules={[FreeMode]}
            prevArrowClassName={style.prev}
            nextArrowClassName={style.next}
          >
            {currentUsedImagesArr.map(({ src, isAdd }, i) => {
              return (
                <SwiperSlide className={cx("curImage-slide")} key={`thumb_main_${i}`}>
                  <button
                    onClick={() => onClickCurImage(src, i, isAdd)}
                    className={cx("curImage-slide-btn", { isAdd: isAdd })}
                  >
                    <img src={src ?? ""} alt={`curImage_${i}`} />
                  </button>
                </SwiperSlide>
              )
            })}
          </SwiperNavigation>
        </>
      )}
      {selectedImages.length > 0 && (
        <button onClick={onClickUpload} className={cx("upload")}>
          <span>{t("total {{number}} pic upload", { number: selectedImages.length })}</span>
        </button>
      )}
    </ModalLayout>
  )
}
