"use client"

import DeleteBtn from "@/components/DeleteBtn"
import Input from "@/components/Input"
import { colors } from "@/config/colors"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { PageStage } from "@/types/Main"
import { getImageUrl } from "@/utils/helpers/getImageUrl"
import hasString from "@/utils/helpers/hasString"
import { faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classnames/bind"
import { useCallback } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function Simple({
  section,
  isDisplayMode,
  setPageStage,
  isButtonVisible,
  imageStatus,
}: {
  section: SectionType
  isDisplayMode?: boolean
  setPageStage?: (type: PageStage) => void
  isButtonVisible: boolean
  imageStatus: "image" | "emoji"
}) {
  const onClickCTA = useCallback(() => {
    setPageStage && setPageStage("form")
  }, [setPageStage])

  const { title, description, cta } = section.data
  const { color, background, backgroundColor } = section.style

  const { setActive } = useEditorStore(["setActive"])

  const onClickThumbnailUpload = () => {
    setActive({ key: "modal", payload: { type: "thumbnail-image" } })
  }

  return (
    <div className={cx("wrapper")}>
      <div
        style={{
          background: background ? getImageUrl({ url: background ?? "" }) : backgroundColor,
        }}
        className={cx("background")}
      >
        {background && !isDisplayMode && <DeleteBtn srcKey={"background"} />}
      </div>

      <div className={cx("main", imageStatus)}>
        {
          <div
            style={{
              background: hasString(section.src) ? getImageUrl({ url: section.src }) : colors.white,
            }}
            className={cx("thumbnail", { isDisplayMode })}
          >
            {hasString(section.src) && !isDisplayMode && <DeleteBtn srcKey={"thumbnail"} />}
            {!isDisplayMode && (
              <button className={cx("drop-zone")} onClick={onClickThumbnailUpload}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            )}
          </div>
        }
        <div className={cx("content")}>
          <Input
            type="input"
            inputType="titleInput"
            className={cx(!isDisplayMode && "title-input")}
            displayMode={isDisplayMode && "h1"}
            isOptional={false}
            dataKey={"title"}
            value={title}
            section={section}
          />
          <Input
            type="textarea"
            inputType="descriptionInput"
            className={cx(!isDisplayMode && "description-input")}
            displayMode={isDisplayMode && "p"}
            isOptional={true}
            dataKey={"description"}
            value={description}
            section={section}
          />
          {isButtonVisible && (
            <div className={cx("cta-wrapper")}>
              <button onClick={setPageStage ? onClickCTA : undefined} className={cx("cta")}>
                <Input
                  type="input"
                  displayMode={isDisplayMode && "span"}
                  inputType="textInput"
                  dataKey={"cta"}
                  isOptional={false}
                  style={{ color }}
                  value={cta}
                  maxLength={20}
                  section={section}
                />
                {isDisplayMode && <FontAwesomeIcon style={{ color }} icon={faChevronRight} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
