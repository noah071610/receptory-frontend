"use client"

import OptionTitleInputs from "@/components/Options/OptionTitleInputs"
import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { memo, useEffect } from "react"
import style from "./style.module.scss"

import DeleteBtn from "@/components/DeleteBtn"
import Input from "@/components/Input"
import OptionRatio from "@/components/Options/OptionRatio"
import { useMainStore } from "@/store/main"
import { getImageUrl } from "@/utils/helpers/getImageUrl"
import hasString from "@/utils/helpers/hasString"
import { faCircle } from "@fortawesome/free-regular-svg-icons"
import { faClose, faMars, faPlus, faVenus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
const cx = cs.bind(style)

function Choices({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { t } = useTranslation()
  const { setActive } = useEditorStore()
  const { userPick, setUserPick } = useMainStore()
  const {
    data: { title, description },
    design,
    list,
    options: { initialSelect },
  } = section
  const selected = userPick[section.id]?.value ?? null

  const onClickThumbnailUpload = (index: number) => {
    setActive({ key: "modal", payload: { type: "choices-image", payload: index } })
  }

  const onClickBtn = (index: number) => {
    setUserPick({ section, payload: index === 0 ? "left" : "right" })
  }

  useEffect(() => {
    setUserPick({ section, payload: initialSelect === "none" ? null : initialSelect })
  }, [initialSelect])

  return (
    <div className={cx("layout")}>
      <label className={cx("title")}>
        <h2>{title}</h2>
        <p>{description}</p>
      </label>
      <div className={cx("choices")}>
        {["left", "right"].map((v, i) => (
          <div onClick={() => onClickBtn(i)} key={v} className={cx("content", design, v, { selected: v === selected })}>
            {design === "basic" && (
              <div className={cx("icon")}>
                <FontAwesomeIcon icon={v === "left" ? faCircle : faClose} />
              </div>
            )}
            {design === "gender" && (
              <div className={cx("icon")}>
                <FontAwesomeIcon icon={v === "left" ? faVenus : faMars} />
              </div>
            )}
            {design === "thumbnail" && (
              <div>
                {!isDisplayMode && (
                  <div style={{ background: getImageUrl({ url: list[i].src }) }} className={cx("thumbnail")}>
                    {hasString(list[i].src) && !isDisplayMode && (
                      <DeleteBtn isSmall={true} listIndex={i} srcKey="choices" />
                    )}
                    <button className={cx("drop-zone")} onClick={() => onClickThumbnailUpload(i)}>
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                )}
                {isDisplayMode && (
                  <picture className={cx("thumbnail", "display")}>
                    <img src={hasString(list[i]?.src) ? list[i].src : "/images/noImage.png"} alt="image" />
                  </picture>
                )}
              </div>
            )}

            <div className={cx("text")}>
              {isDisplayMode ? (
                <p>{list[i].value}</p>
              ) : (
                <Input
                  type="input"
                  className={cx("list-title")}
                  inputType="list-title"
                  isOptional={true}
                  value={list[i].value}
                  listIndex={i}
                  section={section}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      {!isDisplayMode && (
        <div className={cx("options")}>
          <OptionTitleInputs section={section} />
          <OptionRatio optionsArr={["none", "left", "right"]} section={section} targetKey="initialSelect" />
        </div>
      )}
    </div>
  )
}

export default memo(Choices)
