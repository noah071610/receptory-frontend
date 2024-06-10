"use client"

import DeleteBtn from "@/components/DeleteBtn"
import Input from "@/components/Input"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { getImageUrl } from "@/utils/helpers/getImageUrl"
import hasString from "@/utils/helpers/hasString"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import { useParams } from "next/navigation"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function Full({
  section,
  textColor,
  ctaTextColor,
  isDisplayMode,
  onClickCTA,
  isButtonVisible,
}: {
  textColor: string
  ctaTextColor: string
  section: SectionType
  isDisplayMode?: boolean
  onClickCTA?: () => void
  isButtonVisible: boolean
}) {
  const { lang } = useParams()

  const { title, description, cta } = section.data
  const { color, background, backgroundColor } = section.style

  const { setActive } = useEditorStore(["setActive"])

  const onClickThumbnailUpload = () => {
    setActive({ key: "modal", payload: { type: "thumbnail-image" } })
  }

  const mainBackground = background
    ? // 풀 타입 배경 화면
      getImageUrl({ url: background ?? "" })
    : // 풀 타입 백그라운드 컬러
      `linear-gradient(180deg, ${backgroundColor} 87%, rgba(0,0,0,0) 100%)`

  return (
    <div
      style={{
        background: mainBackground,
      }}
      className={cx("wrapper", { isDisplayMode })}
    >
      {background && !isDisplayMode && <DeleteBtn srcKey={"background"} />}
      <div className={cx("main")}>
        {!isDisplayMode && (
          <div style={{ background: getImageUrl({ url: section.src }) }} className={cx("thumbnail")}>
            {hasString(section.src) && <DeleteBtn srcKey={"thumbnail"} />}
            <button className={cx("drop-zone", { hidden: !!section.src })} onClick={onClickThumbnailUpload}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        )}
        {isDisplayMode && hasString(section.src) && (
          <picture className={cx("thumbnail", "display")}>
            <img src={section.src} alt="image" />
          </picture>
        )}
        <Input
          type="input"
          className={cx(!isDisplayMode && "title-input")}
          inputType="titleInput"
          displayMode={isDisplayMode && "h1"}
          isOptional={false}
          dataKey="title"
          style={{ color: textColor }}
          section={section}
          value={title}
        />
        <Input
          type="textarea"
          className={cx(!isDisplayMode && "description-input")}
          inputType="descriptionInput"
          displayMode={isDisplayMode && "p"}
          isOptional={true}
          dataKey="description"
          style={{ color: textColor }}
          value={description}
          section={section}
        />
        {isButtonVisible && (
          <div className={cx("cta-wrapper")}>
            <button onClick={onClickCTA} style={{ backgroundColor: color }} className={cx("cta")}>
              <Input
                type="input"
                displayMode={isDisplayMode && "span"}
                inputType="ctaInput"
                dataKey="cta"
                isOptional={false}
                style={{ color: ctaTextColor }}
                value={cta}
                section={section}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
