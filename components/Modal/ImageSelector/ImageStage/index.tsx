"use client"

import { uploadImages } from "@/actions/upload"
import DeleteBtn from "@/components/DeleteBtn"
import SwiperNavigation from "@/components/SwiperNavigation"
import { useEditorStore } from "@/store/editor"
import { ImageUpload, SectionListType, SectionListTypes } from "@/types/Edit"
import { Langs } from "@/types/Main"
import { createNewSection, createNewSectionList } from "@/utils/createNewSection"
import cs from "classNames/bind"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { FreeMode } from "swiper/modules"
import { SwiperSlide } from "swiper/react"
import Dropzone from "./Dropzone"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function ImageStage({
  type,
  isMultiple,
  setIsLoading,
  lang,
}: {
  type?: string
  isMultiple: boolean
  setIsLoading: (b: boolean) => void
  lang: Langs
}) {
  const [selectedImages, setSelectedImages] = useState<Array<ImageUpload>>([])
  const [listForRending, setListForRending] = useState<SectionListType[]>([])

  const { t } = useTranslation(["modal"])
  const {
    active,
    setActive,
    addSection,
    setStyle,
    setPageEmbedOption,
    homeSections,
    setSrc,
    setList,
    addList,
    addUsed,
    setOptions,
    currentUsedImages,
    saveSectionHistory,
  } = useEditorStore([
    "active",
    "setActive",
    "addSection",
    "setStyle",
    "setPageEmbedOption",
    "homeSections",
    "setSrc",
    "setList",
    "addList",
    "addUsed",
    "setOptions",
    "currentUsedImages",
    "saveSectionHistory",
  ])
  const [currentUsedImagesArr, setCurrentUsedImagesArr] = useState(
    currentUsedImages?.map((v) => ({ src: v, isAdd: false })) ?? []
  )

  const onClickUpload = async () => {
    if (!type) return
    setIsLoading(true)

    // 일단
    const formData = new FormData()
    selectedImages.forEach(({ uploadType, file }) => uploadType === "file" && file && formData.append("files", file))
    let srcArr: string[] | undefined
    if (formData.getAll("files")?.length > 0) {
      srcArr = await uploadImages(formData)
    }

    let imageArr: string[] = []
    if (srcArr) {
      // 이미지 업로드를 한 경우,

      srcArr.forEach((v) => {
        addUsed({ type: "currentUsedImages", payload: v })
      })
      imageArr = selectedImages
        .map(({ uploadType, payload }) => (uploadType === "file" ? srcArr.shift() : payload))
        .filter((v) => !!v) as string[]
    } else {
      // 사용했던 사진만
      imageArr = selectedImages.map(({ payload }) => payload).filter((v) => !!v) as string[]
    }

    for (let k = 0; k < imageArr.length; k++) {
      const payload = imageArr[k]

      if (isMultiple) {
        // slider 와 album 등 섹션을 만들고 이미지를 넣는 경우.
        setListForRending((arr) => [
          ...arr,
          createNewSectionList(type, k, {
            src: payload,
          }),
        ])
      } else {
        // 단순 하나의 이미지를 업로드하는 기본적인 경우
        switch (type) {
          case "thumbnail":
          case "callout":
            setSrc({
              payload,
            })
            if (type === "callout") {
              setOptions({ payload: "image", key: "imageStatus" })
            }
            break
          case "select":
          case "choices":
            setList({
              index: active.modal.payload,
              key: "src",
              payload,
            })
            break
          case "background":
            setStyle({
              key: "background",
              payload,
            })
            break
          case "embed":
            setPageEmbedOption({
              type: "src",
              payload,
            })
            saveSectionHistory()
            break
          default:
            break
        }
        setIsLoading(false)
        break
      }
    }

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
        const newSection = createNewSection({ type: type as SectionListTypes, index: homeSections.length })
        newSection.list = [...filteredImageList]

        addSection({
          type: type as SectionListTypes,
          payload: newSection,
        })
      }
      setListForRending([])
      setIsLoading(false)
      setActive({ payload: { type: null, payload: null }, key: "modal" })
    }
  }, [
    listForRending.length,
    selectedImages.length,
    type,
    homeSections.length,
    listForRending,
    active.modal.payload,
    setIsLoading,
    setActive,
    addList,
    addSection,
  ])

  return (
    <>
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
        <Dropzone lang={lang} isMultiple={isMultiple} setSelectedImages={setSelectedImages} />
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
            prevArrowClassName={cx("prev")}
            nextArrowClassName={cx("next")}
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
          <span>{t("totalUpload", { number: selectedImages.length })}</span>
        </button>
      )}
    </>
  )
}
