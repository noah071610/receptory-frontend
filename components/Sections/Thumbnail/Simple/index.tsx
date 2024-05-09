"use client"

import DeleteBtn from "@/components/DeleteBtn"
import Input from "@/components/Input"
import { getImageUrl } from "@/config"
import { colors } from "@/config/colors"
import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import hasString from "@/utils/hasString"
import { faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import { useParams } from "next/navigation"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function Simple({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { lang } = useParams()
  const { t } = useTranslation(lang, ["new-post-page"])
  const { title, description, cta } = section.data
  const { color, background, backgroundColor } = section.style

  const { setActive, stage } = useEditorStore()
  const isForm = stage === "form"

  const onClickThumbnailUpload = () => {
    setActive({ key: "modal", payload: { type: "thumbnail-image" } })
  }

  return (
    <div className={cx("wrapper")}>
      <div
        style={{
          background: background ? getImageUrl({ isCenter: true, url: background ?? "" }) : backgroundColor,
        }}
        className={cx("background")}
      >
        {background && !isDisplayMode && <DeleteBtn srcKey={"background"} />}
      </div>

      <div className={cx("main")}>
        {
          <div
            style={{
              background: hasString(section.src) ? getImageUrl({ isCenter: true, url: section.src }) : colors.white,
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
            inputType="title"
            className={cx(!isDisplayMode && "title-input")}
            displayMode={isDisplayMode && "h1"}
            isOptional={true}
            dataKey={"title"}
            value={title}
          />
          <Input
            type="textarea"
            inputType="description"
            className={cx(!isDisplayMode && "description-input")}
            displayMode={isDisplayMode && "p"}
            isOptional={true}
            dataKey={"description"}
            value={description}
          />
          {!isForm && (
            <div className={cx("cta-wrapper")}>
              <button className={cx("cta")}>
                <Input
                  type="input"
                  displayMode={isDisplayMode && "span"}
                  inputType="cta"
                  dataKey={"cta"}
                  isOptional={false}
                  style={{ color }}
                  value={cta}
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
