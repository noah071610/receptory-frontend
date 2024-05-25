"use client"

import AddBtn from "@/components/AddBtn"
import DeleteBtn from "@/components/DeleteBtn"
import Input from "@/components/Input"
import { toastError } from "@/config/toast"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { getImageUrl } from "@/utils/helpers/getImageUrl"
import cs from "classNames/bind"
import { memo } from "react"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = cs.bind(style)

const ImageComponent = ({
  src,
  value,
  section,
  index,
  isDisplayMode,
  onDelete,
}: {
  src: string
  value: string
  section: SectionType
  index: number
  isDisplayMode?: boolean
  onDelete: (i: number) => void
}) => {
  return (
    <div className={cx("photo-wrapper")}>
      <picture className={cx("photo")}>
        <img
          // style={{
          //   height: typeof maxHeight === "number" ? `${maxHeight}px` : "100%",
          // }}
          src={src}
          alt={src}
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
        value={value}
        section={section}
      />
    </div>
  )
}

function Album({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { t } = useTranslation()
  const { deleteList } = useEditorStore()

  const onDelete = (i: number) => {
    if (section.list.length <= 1) {
      return toastError("atLeastOneList")
    }
    deleteList({ targetIndex: i })
  }

  return (
    <div className={cx("layout")}>
      {section.list.length > 0 ? (
        <div className={cx("album")}>
          <div
            style={{ gridTemplateColumns: `repeat(${section.design === "gridOne" ? 1 : 2},1fr)` }}
            className={cx("grid", section.options.imageSize, section.design)}
          >
            {section.list.map((v, i) => (
              <ImageComponent
                onDelete={onDelete}
                isDisplayMode={isDisplayMode}
                key={`album_${section.id}_${i}`}
                index={i}
                src={v.src}
                value={v.value}
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
