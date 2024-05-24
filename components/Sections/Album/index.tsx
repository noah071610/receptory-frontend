"use client"

import AddBtn from "@/components/AddBtn"
import DeleteBtn from "@/components/DeleteBtn"
import Input from "@/components/Input"
import { toastError } from "@/config/toast"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { getImageUrl } from "@/utils/helpers/getImageUrl"
import cs from "classNames/bind"
import { memo, useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = cs.bind(style)

const ImageComponent = ({
  photo,
  section,
  maxHeight,
  index,
  isDisplayMode,
  onDelete,
  setMaxHeight,
}: {
  photo: { width?: number; height?: number; src: string; value: any }
  section: SectionType
  maxHeight: null | number
  index: number
  isDisplayMode?: boolean
  onDelete: (i: number) => void
  setMaxHeight: (num: number) => void
}) => {
  const ref = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (ref?.current) {
      setMaxHeight(ref.current.height)
    }
  }, [ref?.current])

  return (
    <div className={cx("photo-wrapper")}>
      <picture className={cx("photo")}>
        <img
          ref={ref}
          // style={{
          //   height: typeof maxHeight === "number" ? `${maxHeight}px` : "100%",
          // }}
          src={photo.src}
          alt={photo.src}
        />
        {/* {status === "loading" && <Loading />} */}
        {!isDisplayMode && <DeleteBtn deleteEvent={onDelete} srcKey="list" listIndex={index} />}
      </picture>
      <Input
        type="input"
        className={cx("title", !isDisplayMode && "input")}
        inputType="album"
        displayMode={isDisplayMode && "p"}
        isOptional={true}
        listIndex={index}
        value={photo.value}
        section={section}
      />
    </div>
  )
}

function Album({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { t } = useTranslation()
  const { deleteList } = useEditorStore()
  const [maxHeight, setMaxHeight] = useState<null | number>(null)

  const galleryImages = useMemo(
    () =>
      section.list
        .map(({ style: { width, height }, src, value }) => ({ width, height, src, value }))
        .filter(({ width, height }) => typeof width === "number" && typeof height === "number"),
    [section.list]
  )

  const onDelete = (i: number) => {
    if (section.list.length <= 1) {
      return toastError("atLeastOneList")
    }
    deleteList({ targetIndex: i })
  }

  return (
    <div className={cx("layout")}>
      {galleryImages.length > 0 ? (
        <div className={cx("album")}>
          <div
            style={{ gridTemplateColumns: `repeat(${section.options.imageSize === "width" ? 1 : 2},1fr)` }}
            className={cx("grid", section.options.imageSize)}
          >
            {galleryImages.map((v, i) => (
              <ImageComponent
                onDelete={onDelete}
                maxHeight={maxHeight}
                setMaxHeight={setMaxHeight}
                isDisplayMode={isDisplayMode}
                key={`album_${section.id}_${i}`}
                index={i}
                photo={v}
                section={section}
              />
            ))}
          </div>
        </div>
      ) : isDisplayMode ? (
        <></>
      ) : (
        <div style={{ background: getImageUrl({ url: "/images/noImage.png" }) }} className={cx("noImage")}>
          <span>{t("noImage")}</span>
        </div>
      )}

      {!isDisplayMode && <AddBtn section={section} type="album-image" />}
    </div>
  )
}

export default memo(Album)
